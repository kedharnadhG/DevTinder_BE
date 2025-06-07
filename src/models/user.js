const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        maxlength: 20,
        required: false
    },
    state: {
        type: String,
        maxlength: 50,
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
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "EmailId already exists"],
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid EmailId: " + value);
            }
        }
        // match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be strong: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: [18, "Age must be greater than 18"],
        required: false
    },
    gender: {
        type: String,
        required: false,
        lowercase: true,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid gender type`,
        }
        // validate(value) {
        //     if(!["male", "female", "others"].includes(value.toLowerCase())) {
        //         throw new Error("Invalid Gender");
        //     }
        // }
    },
    photoUrl: {
        type: String,
        required: false,
        default: "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL: " + value);
            }
        }
    },
    about: {
        type: String,
        required: false,
        maxlength: 100,
        default: "This is a default about of the user!"
    },
    skills: {
        type: [String],
        required: false,
        validate(value) {
            if(value.length > 5) {
                throw new Error("Skills cannot be more than 5");
            }
        }
    },
    address: {
        type: addressSchema,
        required: false
    }
}, {
    timestamps: true
})


// Mongoose Pre Hook - used to encrypt the password before saving
userSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.getJWT = function(){
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    return token;
}


//compare password
userSchema.methods.validatePassword = async function(enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.index({firstName: 1, lastName: 1});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;