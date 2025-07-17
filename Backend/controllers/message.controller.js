import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import {getReceiverSocketId, io} from '../socket/socket.js'
 
export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        message: [newMessage._id],
      });
    } else {

      conversation.message.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId=getReceiverSocketId(receiver)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ msg: `send msg error : ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("message");
    if (!conversation) {
      return res.status(400).json({ msg: "conversation not found" });
    }
    return res.status(200).json(conversation?.message);
  } catch (error) {
    return res.status(500).json({ msg: `get msg err :${error}` });
  }
};
