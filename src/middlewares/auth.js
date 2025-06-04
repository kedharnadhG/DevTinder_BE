 const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "xyz";   // which is getting from the client

    const isAdminAuthorized = token === "xyz";  // "xyz" is db-stored one

    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access");
    } else {
        next();
    }
};
 
const userAuth = (req, res, next) => {
    console.log("User auth is getting checked!")
    const token = "sdfesxyz";   // which is getting from the client

    const isUserAuthorized = token === "xyz";  // "xyz" is db-stored one

    if(!isUserAuthorized){
        res.status(401).send("Unauthorized Access");
    } else {
        next();
    }
};



module.exports = {
    adminAuth,
    userAuth

};



