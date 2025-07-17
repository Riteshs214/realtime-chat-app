import { configureStore } from "@reduxjs/toolkit";
import userSlicer from "./userSlice";
import messageSlice from "./messageSlice";
export const store = configureStore({
  reducer: {
    user: userSlicer,
    message: messageSlice,
  },
});
