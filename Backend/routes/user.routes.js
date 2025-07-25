import express from "express";
import { editProfile, getCurrentUser, getOthersUsers, search } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import {upload} from '../middlewares/multer.js'
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/others", isAuth, getOthersUsers);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/search", isAuth, search);

export default userRouter;
