const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "age", "gender", "photoUrl", "about", "skills", "address"];
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field))
    // console.log(isEditAllowed);
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}