import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";

const SenderMessage = ({ image, message }) => {
  let scroll = useRef();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-start gap-2">
      <div
        ref={scroll}
        className="w-fit max-w-[450px] px-3 py-1 text-white bg-[rgb(23,151,194)] rounded-tr-none rounded-lg ml-auto shadow-lg shadow-gray-500 relative right-0 gap-1 flex flex-col "
      >
        {image && (
          <img
            src={image}
            alt=""
            className="w-[100px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <div
        className="w-[40px] h-[40px] rounded-full overflow-hidden flex bg-white justify-center items-center border-0 shadow-xl object-contain shadow-gray-700 cursor-pointer"
        
      >
        <img
          src={userData?.image || dp}
          alt=""
          className="h-[100%] w-full  rounded-full"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
