const express = require('express');
const { connect, getDBStatus } = require("./config/database");
const dotenv = require("dotenv");
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validation")
const validator = require("validator");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 7778;


//body-parser
app.use(express.json());


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

        const isPasswordValid = await user.comparePassword(password);

        if(isPasswordValid){
            res.send("Login Successful");
        }
        else{
            throw new Error("Invalid Credentials");
        }
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

});


// GET User by email
app.get("/user", async (req, res) => {

    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            return res.status(404).send("User Not Found");
        }else {
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }

});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({}); //we will pass empty-Filter to get all the users
        if(users.length === 0){
            return res.status(404).send("No users found");
        }else {
            res.send(users);
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// Delete User by Id
app.delete("/user", async (req, res) => {

    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        // const user = await User.findByIdAndDelete({_id: userId});
        // const user = await User.findOneAndDelete({_id: userId});
        if(!user){
            return res.status(404).send("User Not Found");
        }else {
            res.send("User Deleted Successfully");
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// Find by Id and Update (using PATCH Method)
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    //allowing only fixed updatable fields (remaining aren't allowed to be updated)
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age", "address"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if(!isUpdateAllowed){
        return res.status(400).send("Update is not allowed");
    }

    try {
        const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after", runValidators: true}); //(we can pass "id" also directly) this 3rd argument will return the updated document(i.e options we can pass (new: true) also works)
        // console.log(user);
        res.send("User Updated Successfully");

    } catch (error) {
        res.status(500).send("Something went wrong: " + error.message);
    }

});



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
