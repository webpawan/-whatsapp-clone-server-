import Chat from "../models/chatModels.js";
import User from "../models/userModels.js";
import asyncHandler from "express-async-handler";

// asyncHandler is prakar sa work karta ha try catch ni likhna padega or youtube per bhe search lo

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userid param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat > 0) {
    res.send([0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullchat);
    } catch (error) {
      console.log(error);
      res.status(400).json("big mistake");
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    console.log(error);
    res.status(400).json("some wrong with fetchChat");
  }
});

export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json("please fill all fields");
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).json("more then 2 user required for a group chat");
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(400).send("problem with group chat");
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { name: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400).send("grouprename problem");
  } else {
    res.json(updatedChat);
  }
});

export const addGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = Chat.findByIdAndUpdate(chatId, { $push: { users: userId } },{new:true});
});
