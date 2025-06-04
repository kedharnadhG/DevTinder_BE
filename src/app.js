const express = require('express');
const { connect, getDBStatus } = require("./config/database");
const dotenv = require("dotenv");
const User = require("./models/user")


dotenv.config();


const app = express();
const PORT = process.env.PORT || 7778;


app.post("/signup", async(req, res) => {
    const user = new User({
        firstName: "bharath",
        lastName: "g",
        emailId: "bharath@bharath",
        password: "bharath@123",
        age: 23,
        gender: "male",
        phoneNumber: "8898824988"
    })

    try {
        await user.save();
        res.status(201).send("User Created Successfully");
    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).send("Something went wrong");
    }
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
