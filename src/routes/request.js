const express = require("express")
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");
const ApiResponse = require("../utils/ApiResponse");

const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
    
    try {
        const fromUserId= req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("Status is not valid");
        }

        // check if toUserId is valid or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
        }

        //check if the request is already sent or not
        const connectionRequestExists = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(connectionRequestExists){
            return res 
                .status(400)
                .json(new ApiResponse(400, null, "Connection Request Already Exists!!!")); 
        }

         const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json(new ApiResponse(200, data, `${req.user.firstName} ${status=== "ignored" ? "ignored" : "sent"} connection request to ${toUser.firstName}`));

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {


    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json(new ApiResponse(400, null, "Status is not valid"));
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName");

        if(!connectionRequest){
            return res.status(400).json(new ApiResponse(400, null, "Connection Request Not Found"));
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json(new ApiResponse(200, data, `${loggedInUser.firstName} ${status} connection request of ${connectionRequest.fromUserId.firstName}`));

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

});

module.exports = requestRouter;