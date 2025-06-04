const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    pinCode: {
        type: Number,
        required: false
    }
})

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);