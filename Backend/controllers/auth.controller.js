import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const checkUserByUsername = await User.findOne({ username });
    if (checkUserByUsername)
      return res.status(400).json({ msg: "Username is already exist" });

    const checkUserByEmail = await User.findOne({ email });
    if (checkUserByEmail)
      return res.status(400).json({ msg: "Email is already exist" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });

    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashPass });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: `signup error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Username or Password incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Username or Password incorrect" });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: `login error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token").json({ msg: "logout successfully" });
  } catch (error) {
    return res.status(500).json({ error: `logout error ${error}` });
  }
};
