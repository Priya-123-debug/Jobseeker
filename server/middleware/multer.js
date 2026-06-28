import multer from "multer";

const storage = multer.memoryStorage();

const uploadProfileImage = multer({ storage }).single("profileImage");
export const singleUpload = (req, res, next) => {
  uploadProfileImage(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

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