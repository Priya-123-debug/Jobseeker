import multer from "multer";

const storage = multer.memoryStorage();

// Register — profile image only (field name: "profileImage")
const uploadProfileImage = multer({ storage }).single("profileImage");
export const singleUpload = (req, res, next) => {
  uploadProfileImage(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

// Profile update — resume only (field name: "resume")
const uploadResume = multer({ storage }).single("resume");
export const resumeUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

// Profile update — both profile image + resume together
const uploadMultiple = multer({ storage }).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume",       maxCount: 1 },
]);
export const multiUpload = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};