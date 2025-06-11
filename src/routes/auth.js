const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const validator = require("validator");
const ApiResponse = require("../utils/ApiResponse");

const authRouter = express.Router();

//Signing up a new user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password - Hashing (used Hooks in Mongoose, see in the User-Model)

    // creating a new-Instance of the User-Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
    });

    const savedUser = await user.save();

    const token = savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });

    res
      .status(201)
      .json(new ApiResponse(201, { savedUser }, "Signed Up Successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

//login a user
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    return res.status(400).send("Please enter a valid email");
  }

  try {
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      });

      res.json(new ApiResponse(200, { user }, "Login Successful"));
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json(new ApiResponse(200, {}, "Logout Successful"));
});

module.exports = authRouter;
