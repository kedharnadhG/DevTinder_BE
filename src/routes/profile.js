const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")
const User = require("../models/user");
const validator = require("validator");

//GET Profile of a User
profileRouter.get("/profile/view", userAuth , async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
        
    }
})

profileRouter.patch("/profile/edit", userAuth , async (req, res) => {
    try {
        // console.log(req.body);
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        })

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

profileRouter.patch("/profile/password", userAuth , async (req, res) => { 
    try {
        const user = req.user;
        const {oldPassword, newPassword} = req.body;
        const userData = await User.findOne({emailId: user.emailId}).select("+password");
        const isPasswordValid = await userData.validatePassword(oldPassword);
        
        if(isPasswordValid){

            if(!validator.isStrongPassword(newPassword)){
                throw new Error("Please enter a strong password");
            }

            user.password = newPassword;
            await user.save();
            res.send("Password Updated Successfully");
        }
        else{
            throw new Error("Invalid Old Password");
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;