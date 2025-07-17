import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

const Login = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      setEmail("");
      setPassword("");
      setLoading(false);
      setErr("");
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-300 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-96 bg-white overflow-hidden rounded-lg shadow-lg shadow-gray-400 flex flex-col gap-8">
        <div className="w-full h-24 shadow-lg shadow-gray-400 bg-blue-500 rounded-b-[35%] flex justify-center items-center">
          <h1 className="text-[25px] text-white tracking-wide font-semibold">
            Login to M-Chat
          </h1>
        </div>
        <form
          action=""
          className="flex flex-col gap-4 justify-center items-center"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            name="email"
            className="border-2 shadow-lg border-blue-700 rounded-md outline-none px-4 py-1 text-gray-700 w-[70%] "
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="rounded-md border-2 shadow-lg border-blue-700 w-[70%] overflow-hidden relative">
            <input
              type={`${show ? "text" : "password"}`}
              name="password"
              className="  outline-none px-4 py-1 text-gray-700 w-full"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShow((prev) => !prev)}
              className=" absolute top-1 right-2 text-sm text-blue-500 font-bold cursor-pointer"
            >
              {`${show ? "Show" : "Hidden"}`}
            </span>
          </div>

          {err && <p className="text-red-600 text-sm">* {err}</p>}

          <button
            className="px-5 rounded-lg text-white transition-transform hover:scale-95 bg-green-700 py-2 shadow-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p
            onClick={() => navigate("/signup")}
            className="text-slate-600 cursor-pointer"
          >
            Want to create new Account?{" "}
            <span className="text-sky-600 ">Signup</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
