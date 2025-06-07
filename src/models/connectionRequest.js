const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {
    timestamps: true
})


connectionRequestSchema.pre("save", function(next){
    
    const connectionRequest = this;
    //check if the fromUserId is same as the toUserId or not
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send connection request to yourself!");
    }
    next();
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true});



const ConnectionRequestModel =  mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;