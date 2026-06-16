
// const storage = multer.memoryStorage();
// export const singleUpload = multer({ storage }).single("profileImage");
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profileImage");

export const singleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
     
      return res.status(400).json({ success: false, message: err.message });
    }
    
    next();
  });
};

