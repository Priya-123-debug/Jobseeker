import User from "../Model/usermodel.js";

// Toggle bookmark (add if not exists, remove if exists)
export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isBookmarked = user.bookmarks.includes(jobId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== jobId
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Bookmark removed",
        isBookmarked: false
      });
    } else {
      // Add bookmark
      user.bookmarks.push(jobId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Job bookmarked",
        isBookmarked: true
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookmarked jobs
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: {
        path: "company"
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      bookmarks: user.bookmarks
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};