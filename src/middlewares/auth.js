const jwt = require('jsonwebtoken')
const User = require('../models/user')

const adminAuth = (req,res, next) => {
    console.log("admin auth middleware");
    const token = "xyz";
    const adminAuthentication = token === "xyz";

    if(!adminAuthentication){
        res.status(401).send("Unauthorized");
    }
    else {
        next();
    }
}

const userAuth = async (req, res, next) => {
    try{
    const {token} = req.cookies;

    if(!token){
        throw new Error("Token is not valid!");
    }

    const decodeObj = await jwt.verify(token, "DEV@Tinder$790");

    const {_id} = decodeObj;

    const user = await User.findOne({_id});
    if(!user) {
        throw new Error('User not found');
    }
    req.user = user;
    next();
    }
    catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }

}

module.exports = {adminAuth, userAuth};