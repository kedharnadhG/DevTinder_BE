const express = require('express');
const { connect, getDBStatus } = require("./config/database");
const dotenv = require("dotenv");
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validation")
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 7778;


//body-parser
app.use(express.json());
app.use(cookieParser());

//Signing up a new user
app.post("/signup", async(req, res) => {
    try {
        //Validation of the data
        validateSignUpData(req);
        
        const {firstName, lastName, emailId, password} = req.body;

        //Encrypt the password - Hashing (used Hooks in Mongoose, see in the User-Model)

        // creating a new-Instance of the User-Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password
        });

        await user.save();
        res.status(201).send("User Created Successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR: " + error.message);
    }
});


//login a user
app.post("/login", async(req, res) => {

    const {emailId, password} = req.body;

    if(!validator.isEmail(emailId)){
        return res.status(400).send("Please enter a valid email");
    }

    try {
        const user = await User.findOne({emailId}).select("+password");
        if(!user){
            throw new Error("Invalid Credentials");
        };

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = user.getJWT();

            res.cookie("token", token, {httpOnly: true, secure: true, sameSite: "none", expires: new Date(Date.now() + 8 * 60 * 60 * 1000)});

            res.send("Login Successful");
        }
        else{
            throw new Error("Invalid Credentials");
        }
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

});

//GET Profile of a User
app.get("/profile", userAuth , async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
        
    }
})


app.post("/sendConnectionRequest", userAuth, async(req, res) => {
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName + " Sent the Connection Request");
})



connect()
    .then(() => {
        console.log("and Status is", getDBStatus());

        app.listen(PORT, () => {
            console.log('Server is successfully listening on http://localhost:7777');
        });
    })
    .catch((err) => {
        console.log("Error connecting to database", err);
        process.exit(1);
    })
