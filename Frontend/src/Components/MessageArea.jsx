import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { serverURL } from "../main";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";

const MessageArea = () => {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let image = useRef();
  let dispatch = useDispatch();
  let { message } = useSelector((state) => state.message);
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImg, setFrontendImg] = useState(null);
  const [backendImg, setBackendImg] = useState(null);

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImg(file);
    setFrontendImg(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImg==null) {
      return null;
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImg) {
        formData.append("image", backendImg);
      }
      let result = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...message, result.data]));
      setInput("");
      setFrontendImg(null);
      setBackendImg(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInp) => prevInp + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      dispatch(setMessages([...message, msg]));
    });
    return ()=>socket?.off("newMessage")
  }, [message, setMessages]);

  return (
    <div
      className={`lg:w-[70%] ${
        selectedUser ? "flex" : "hidden"
      }  lg:flex w-full h-full bg-slate-300 lg:border-l-2 relative border-gray-500`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col relative">
          {/* top section */}
          <div className="w-full  shadow-gray-400 flex items-center   px-4 h-14 shadow-lg gap-5 bg-[rgb(11,74,95)] rounded-b-2xl ">
            <IoIosArrowRoundBack
              className="w-[45px] h-[45px] text-white"
              onClick={() => dispatch(setSelectedUser(null))}
            />

            <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex bg-white justify-center items-center border-0 shadow-xl object-contain shadow-gray-700 cursor-pointer ">
              <img
                src={selectedUser?.image || dp}
                alt=""
                className="h-[100%] w-full  rounded-full"
              />
            </div>
            <h1 className="text-white font-semibold text-[20px]">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          {/* mid section */}
          <div className="w-full h-[78vh] flex flex-col px-3 gap-2 py-6 overflow-auto">
            {showPicker && (
              <div className="absolute bottom-[90px]   ">
                <EmojiPicker
                  width={350}
                  height={380}
                  className="shadow-lg z-[100]"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {message &&
              message.map((msg) =>
                msg.sender == userData._id ? (
                  <SenderMessage
                    key={msg._id}
                    image={msg.image}
                    message={msg.message}
                  />
                ) : (
                  <ReceiverMessage
                    key={msg._id}
                    image={msg.image}
                    message={msg.message}
                  />
                )
              )}
          </div>

          {/* bottom section */}
          <div className="w-full lg:w-[70%] h-[80px] fixed bottom-[5px] flex items-center justify-center">
            {frontendImg && (
              <img
                src={frontendImg}
                alt=""
                className="w-[90px] absolute bottom-16 right-4 rounded-lg shadow-lg"
              />
            )}
            <form
              className="w-[95%] shadow-gray-400 shadow-lg lg:w-[70%] h-[40px] bg-[rgb(11,74,95)] rounded-full flex items-center gap-5 px-4 "
              onSubmit={handleSendMessage}
            >
              <div className="" onClick={() => setShowPicker((prev) => !prev)}>
                <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
              </div>
              <input
                type="file"
                ref={image}
                hidden
                accept="image/*"
                onChange={handleImage}
              />
              <input
                type="text"
                className="w-full h-full px-3 outline-none border-0 text-xl text-gray-700"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              {/* <div className="" onClick={() => image.current.click()}>
                <FaImages className="w-[25px] h-[25px] text-white cursor-pointer" />
              </div> */}
              {/* {(input.length > 0 || backendImg != null) && ( */}
                <button className="">
                  <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer" />
                </button>
              {/* )} */}
            </form>
          </div>
        </div>
      )}
      {/* welcome msg*/}
      {!selectedUser && (
        <div className="w-full h-full flex flex-col  justify-center items-center">
          <h1 className="text-[30px] font-bold text-slate-600">
            Welcome to Mera-Chat App
          </h1>
          <span className="text-slate-600 font-semibold text-[18px]">
            Chat Friendly !
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
