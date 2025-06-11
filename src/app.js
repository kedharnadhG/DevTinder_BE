const express = require('express');
const { connect, getDBStatus } = require("./config/database");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 7778;

require("./utils/cronjob");

//CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Access-Control-Allow-Origin",
        "device-remember-token",
        "Origin"
    ]
}))

//body-parser
app.use(express.json());
app.use(cookieParser());



// API - Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




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
