import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: `server error : ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let user = await User.findByIdAndUpdate(
      req.userId,
      { name, image },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: `profile error : ${error}` });
  }
};

export const getOthersUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: `get other users error :${error}` });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: "query is required" });
    }
    let users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: `search error :${error}` });
  }
};
