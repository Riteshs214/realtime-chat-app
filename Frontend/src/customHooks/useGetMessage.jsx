import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverURL } from "../main";
import { setOtherUsers, setUserData } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";

const useGetMessage = () => {
  let dispatch = useDispatch();
  let { userData ,selectedUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMessage = async () => {
      if (!selectedUser?._id || !userData?._id) return;
      try {
        let result = await axios.get(`${serverURL}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [selectedUser,userData]);
};
export default useGetMessage;
