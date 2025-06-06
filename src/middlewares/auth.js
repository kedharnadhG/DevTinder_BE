const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
    
        if(!token){
            res.status(401).send("Token not valid!!!!!!!!!!");
        }
    
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decodedData._id);
    
        if(!user){
            res.status(401).send("Unauthorized Access");
        }
        else{
            req.user = user;
            next();
        }
    } catch (error) {
       res.status(400).send("ERROR: " + error.message);
        
    }
};



module.exports = {
    userAuth
};



