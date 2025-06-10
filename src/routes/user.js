const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const ApiResponse = require("../utils/ApiResponse");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);

        res.json( new ApiResponse(200, connectionRequests, "Data Fetched Successfully"));

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})


userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .select("_id")
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        
        const data = connectionRequests.map((row) => {
            return row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId;
        });

        res.json(new ApiResponse(200, data, "Data Fetched Successfully"));

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        
        const loggedInUser = req.user;

        // for pagination
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        // make sure to hide the loggedInUser (his own card; optional-check)
        hideUsersFromFeed.add(loggedInUser._id.toString());

        //users to see in feed
        const users = await User.find({
            _id: {
                $nin: Array.from(hideUsersFromFeed)
            }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json(new ApiResponse(200, users, "Data Fetched Successfully"));

    } catch (error) {
        res.status(400).json({  message:  error.message });
    }
})

module.exports = userRouter;