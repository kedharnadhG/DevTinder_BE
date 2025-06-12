const socket = require("socket.io");
const crypto = require("crypto");
const ApiResponse = require("./ApiResponse");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const isFriendOrNot = async (userId, targetUserId) => {
  const isFriend = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
      { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
    ],
  });

  return isFriend;
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //Handle socket events here

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + "Joined room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // save messages to the database
        try {
          // check if the user is friend or not
          const isFriend = await isFriendOrNot(userId, targetUserId);
          if (!isFriend) {
            throw new Error("User is not a friend");
          }

          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " : " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
          });
        } catch (error) {
          res.json(new ApiResponse(400, null, error.message));
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket, isFriendOrNot };
