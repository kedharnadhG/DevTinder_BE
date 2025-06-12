const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const ApiResponse = require("../utils/ApiResponse");
const { isFriendOrNot } = require("../utils/socket");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req?.user._id;

  try {
    const isFriend = await isFriendOrNot(userId, targetUserId);
    if (!isFriend) {
      throw new Error("User is not a friend");
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.json(new ApiResponse(200, chat, "Chat Fetched Successfully"));
  } catch (err) {
    res.json(new ApiResponse(400, null, err.message));
  }
});

module.exports = chatRouter;
