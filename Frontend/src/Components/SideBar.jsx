import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../main";

const SideBar = () => {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverURL}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full h-full overflow-hidden bg-slate-200 relative lg:block ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div className="w-full shadow-gray-400 flex justify-center flex-col  px-4 h-48 shadow-lg  bg-blue-500 rounded-b-[25%] ">
        <div className="flex items-center justify-between">
          <h1 className="text-[25px] text-white tracking-wide font-semibold">
            M-Chat App
          </h1>

          <BiLogOut
            className="w-[25px] h-[25px] text-white cursor-pointer"
            onClick={handleLogout}
          />
        </div>
        <div className="w-full flex justify-between items-center px-2">
          <h1 className="text-gray-900 font-sans font-semibold text-[20px]">
            Hii ,{userData?.name || "User"}
          </h1>

          <div
            className="w-[55px] h-[55px] rounded-full overflow-hidden flex bg-white justify-center items-center border-0 shadow-xl object-contain shadow-gray-700 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || dp}
              alt=""
              className="h-[100%] w-full  rounded-full"
            />
          </div>
        </div>

        <div className="px-3 py-3 w-full flex items-center">
          {!search && (
            <div
              className="w-[38px] h-[38px] rounded-full overflow-hidden flex justify-center items-center  shadow-gray-700 shadow-lg bg-slate-100 cursor-pointer "
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className="w-[25px] h-[25px]" />
            </div>
          )}

          {search && (
            <form className="w-full h-[38px] bg-white shadow-gray-500 shadow-lg flex items-center rounded-xl  overflow-hidden  px-3">
              <IoIosSearch className="w-[25px] h-[25px] mr-3" />
              <input
                type="text"
                placeholder="Search users..."
                className="outline-none w-full h-full border-0"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer hover:scale-110 ml-2"
                onClick={() => setSearch(false)}
              />
            </form>
          )}

          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    className="relative rounded-full shadow-gray-700 shadow-xl ml-2 flex justify-center items-center bg-white cursor-pointer"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="w-[43px] h-[43px] rounded-full overflow-hidden flex justify-center items-center    ">
                      <img
                        src={user.image || dp}
                        alt=""
                        className="h-[100%] rounded-full"
                      />
                    </div>
                    <span className="w-2 h-2 rounded-full absolute bottom-0 right-0 bg-[#3aff20]"></span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* search users */}
      {input.length > 0 && (
        <div className="flex absolute top-[200px] bg-slate-200 w-full h-[300px] overflow-y-auto flex-col items-center gap-2 z-[150] px-4">
          {otherUsers
            ?.filter(
              (user) =>
                user._id !== userData._id && // exclude self
                user.name.toLowerCase().includes(input.toLowerCase()) // match search
            )
            .map((user) => (
              <div
                className="w-[95%] h-[45px] flex  items-center gap-2 shadow-gray-500 bg-white shadow-lg rounded-full hover:bg-[#faf9f9d5] cursor-pointer"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setInput("");
                  setSearch(false);
                }}
              >
                <div className="relative rounded-full shadow-gray-700 shadow-xl ml-2 flex justify-center items-center bg-white">
                  <div className="w-[43px] h-[43px] rounded-full overflow-hidden flex justify-center items-center    ">
                    <img
                      src={user.image || dp}
                      alt=""
                      className="h-[100%] rounded-full"
                    />
                  </div>
                  {onlineUsers?.includes(user._id) && (
                    <span className="w-2 h-2 rounded-full absolute bottom-0 right-0 bg-[#3aff20]"></span>
                  )}
                </div>

                <h1 className="text-gray-800 font-semibold text-[18px]">
                  {user.name || user.username}
                </h1>
              </div>
            ))}
        </div>
      )}

      <div className="w-full h-[60%] overflow-auto flex flex-col gap-2 px-3 items-center mt-4">
        {otherUsers?.map((user) => (
          <div
            className="w-[95%] h-[45px] flex  items-center gap-2 shadow-gray-500 bg-white shadow-lg rounded-full hover:bg-[#faf9f9d5] cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full shadow-gray-700 shadow-xl ml-2 flex justify-center items-center bg-white">
              <div className="w-[43px] h-[43px] rounded-full overflow-hidden flex justify-center items-center    ">
                <img
                  src={user.image || dp}
                  alt=""
                  className="h-[100%] rounded-full"
                />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-2 h-2 rounded-full absolute bottom-0 right-0 bg-[#3aff20]"></span>
              )}
            </div>

            <h1 className="text-gray-800 font-semibold text-[18px]">
              {user.name || user.username}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
