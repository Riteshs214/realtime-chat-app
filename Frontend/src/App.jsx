import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useGetCurrUser from "./customHooks/useGetCurrUser";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import useGetOtherUsers from "./customHooks/useGetOtherUsers";
import { io } from "socket.io-client";
import { serverURL } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

const App = () => {
  useGetCurrUser();
  useGetOtherUsers();
  let { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverURL}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close();
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
  }, [userData]);
  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to={"/profile"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/login"} />}
        
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
};
export default App;
