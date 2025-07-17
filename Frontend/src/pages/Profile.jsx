import React, { useRef, useState } from "react";
import dp from "../assets/dp.png";
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import axios from "axios";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [frontendImg, setFrontendImg] = useState(userData.image || dp);
  const [backendImg, setBackendImg] = useState(null);
  const [saving, setSaving] = useState(false);
  let navigate = useNavigate();
  let image = useRef();
  let dispatch = useDispatch();

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImg(file);
    setFrontendImg(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImg) {
        formData.append("image", backendImg);
      }
      let result = await axios.put(`${serverURL}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setSaving(false);
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setSaving(false);
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-4">
      <div className="fixed top-4 left-4 cursor-pointer">
        <IoIosArrowRoundBack
          className="w-[45px] h-[45px]"
          onClick={() => navigate("/")}
        />
      </div>
      <div
        className="bg-white rounded-full border-2 border-slate-900 shadow-gray-400 shadow-xl relative "
        onClick={() => image.current.click()}
      >
        <div className="w-40 h-40 rounded-full overflow-hidden flex justify-center items-center">
          <img src={frontendImg} alt="" className="h-[100%]" />
        </div>
        <div className=" rounded-full absolute bottom-4 bg-gray-800 right-4 flex justify-center items-center shadow-lg p-1 cursor-pointer">
          <IoCameraOutline className="w-[20px] h-[20px] text-white" />
        </div>
      </div>
      <form
        className="flex flex-col gap-4 justify-center items-center max-w-[450px] w-[90%]"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={(e) => handleImage(e)}
        />
        <input
          className="border-2 shadow-lg border-blue-700 rounded-md outline-none px-4 py-1 text-gray-800 w-[95%] "
          placeholder="Enter your name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border-2 shadow-lg border-blue-700 rounded-md outline-none px-4 py-1 text-gray-500 w-[95%] "
          type="text"
          value={userData?.username}
          readOnly
        />
        <input
          className="border-2 shadow-lg border-blue-700 rounded-md outline-none px-4 py-1 text-gray-500 w-[95%] "
          type="email"
          value={userData?.email}
          readOnly
        />
        <button
          className="px-5 rounded-lg text-white transition-transform hover:scale-95 bg-green-700 py-2 shadow-lg"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
