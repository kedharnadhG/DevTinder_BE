const express = require("express")
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");
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
            return res.status(404).send("User not found");
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
                .send({message: "Connection Request Already Exists!!!"});
        }

         const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} ${status=== "ignored" ? "ignored" : "sent"} connection request to ${toUser.firstName}`,
            data,
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})


module.exports = requestRouter;