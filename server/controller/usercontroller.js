import User from "../Model/usermodel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utlis/datauri.js";
import cloudinary from "../utlis/cloudnary.js";
import { sendOtpEmail } from "../utlis/sendEmail.js";






import Otp from "../Model/Otp.js";

import { generateOtp } from "../utlis/otpgenerator.js";
export const register = async (req, res) => {
   console.log("req.file:", req.file); // Add this
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const file = req.file; // profile image from frontend
    if (!file) {
  return res.status(400).json({ success: false, message: "Profile image required" });
}else{
  console.log("rec");
}

    // 1. Validate
    if (!fullname || !email || !phoneNumber || !password || !role || !file) {
      return res.status(400).json({
        message: "Missing fields",
        success: false
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false
      });
    }

    // // 2. Upload image to Cloudinary
  
    // Upload profile image
const fileUri = getDataUri(file);              // DataURIParser object
const cloudResponse = await cloudinary.uploader.upload(fileUri.content);  // base64 string


    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user with profile image
    const newUser = await User.create({
      fullname,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profileImage: cloudResponse.secure_url
      }
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
	


    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,  
        sameSite: "none",
         secure: true
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
         user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
       phoneNumber:user.phoneNumber,
       profile:user.profile
    },
      });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};











export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const otp = generateOtp();

   
    const otpHash = await bcrypt.hash(String(otp), 10);

   

    await Otp.deleteMany({ email: normalizedEmail });

    await Otp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpEmail(normalizedEmail, otp);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
  }
};



export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "email and otp are required"
      });
    }

    const normalizedEmail = email.toLowerCase();
    const cleanOtp = String(otp).trim();
 


    const record = await Otp.findOne({ email: normalizedEmail })
      .sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found"
      });
    }
  
    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }
    




    const isMatch = await bcrypt.compare(cleanOtp, record.otpHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    record.isVerified = true;
    await record.save();
    const user = await User.findOne({ email: normalizedEmail }).select("-password");


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
	


    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,  
         sameSite: "none",
  secure: true
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
         user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
       phoneNumber:user.phoneNumber,
       profile:user.profile
    },
      });


  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
  

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    // // 1️⃣ Find OTP
    // const record = await Otp.findOne({ email }).sort({ createdAt: -1 });
    const record = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (!record.isVerified) {
      return res.status(400).json({ success: false, message: "OTP not verified" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // 2️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3️⃣ Update user password
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    user.password = hashedPassword;
    await user.save();

    // 4️⃣ Delete OTP
    await Otp.deleteOne({ _id: record._id });

    res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true
    }).json({
      message: "logged out successfully",
      success: true
    });
  } catch (err) {
    console.log(err);
  }
}



export const updateprofile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;
    const file=req.file;
    const fileuri=getDataUri(file);
    const cloudresponse=await cloudinary.uploader.upload(fileuri.content);


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email.toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (!user.profile) user.profile = {};

    if (bio !== undefined) user.profile.bio = bio;
    if (Array.isArray(skills)) user.profile.skills = skills;
  if (cloudresponse) {
  if (!user.profile) {
    user.profile = {};
  }

  user.profile.resume = cloudresponse.secure_url;
  user.profile.resumeoriginalname = file.originalname;
}


    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

