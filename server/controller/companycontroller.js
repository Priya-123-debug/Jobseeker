import { company } from "../Model/company.js";
import cloudinary from "../utlis/cloudnary.js";
import getDataUri from "../utlis/datauri.js";

/**
 * REGISTER COMPANY
 */
export const registerCompany = async (req, res) => {
  try {
    const { CompanyName, website, description, location } = req.body;

    if (!CompanyName || !website) {
      return res.status(400).json({
        success: false,
        message: "Company name and website are required",
      });
    }

    const exists = await company.findOne({ name: CompanyName });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Company already registered",
      });
    }

    const newCompany = await company.create({
      name: CompanyName,
      website,
      description,
      location,
      userID: req.id,
    });

    return res.status(201).json({
      success: true,
      Company: newCompany,
      message: "Company registered successfully",
    });

  } catch (error) {
    console.error("Register Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET COMPANIES
 */
export const getComapny = async (req, res) => {
  try {
    const companies = await company.find({ userID: req.id });

    return res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    console.error("Get Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET COMPANY BY ID
 */
export const getCompanyById = async (req, res) => {
  try {
    const Company = await company.findById(req.params.id);

    if (!Company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
       company: Company,
    });

  } catch (error) {
    console.error("Get Company By Id Error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid company ID",
    });
  }
};

/**
 * UPDATE COMPANY
 */
export const updateCompany = async (req, res) => {
  try {
    const { CompanyName, description, website, location } = req.body;

    const updateData = {
      name: CompanyName,
      description,
      website,
      location,
    };

    // upload logo only if provided
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );
      updateData.logo = cloudResponse.secure_url;
    }

    const updatedCompany = await company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      Company: updatedCompany,
      message: "Company updated successfully",
    });

  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
