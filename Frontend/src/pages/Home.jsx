import React from "react";
import SideBar from "../Components/SideBar";
import MessageArea from "../Components/MessageArea";
import { useSelector } from "react-redux";
import getMessage from '../customHooks/useGetMessage'

const Home = () => {
  let { selectedUser } = useSelector((state) => state.user);
  getMessage();
  return (
    <div className="w-full h-[100vh] flex overflow-hidden ">
      <SideBar />
      <MessageArea />
    </div>
  );
};

export default Home;
