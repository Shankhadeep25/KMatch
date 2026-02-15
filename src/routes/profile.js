const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validation')
const validator = require("validator")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        await loggedInUser.save()

        res.json({message : `${loggedInUser.firstName}, your Profile Updated Successfully!`,
                    data: loggedInUser})
    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message)
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body

        if(!oldPassword || !newPassword) {
            throw new Error("Old password and new password require")
        }

        const loggedInUser = req.user

        const isPasswordValid = await loggedInUser.validatePassword(oldPassword)
        if(!isPasswordValid){
            throw new Error("Invalid credentials")
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("New password is not strong enough")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        loggedInUser.password = hashedPassword;

        await loggedInUser.save()

        res.json({message: "Password updated successfully",
            data: loggedInUser
        })
    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message)
    }
})

module.exports = {profileRouter}