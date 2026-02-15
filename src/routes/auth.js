const express = require("express")
const authRouter = express.Router()
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
    try{
        validateSignUpData(req);

        const {firstName, lastName, emailId ,password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully!")
    }
    catch (err) {
        res.status(400).send("Error saving the user" + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId})
        if(!user) {
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid) {
            const token = await user.getJWT();

            console.log(token)
            res.cookie("token", token, {
              expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successful!!!")
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = {authRouter}