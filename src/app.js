const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth} = require("./middlewares/auth")

const {adminAuth} = require('./middlewares/auth');
const app = express();

app.use(express.json());
app.use(cookieParser())


app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId)
        res.send("User Deleted successfully")
    }
    catch (err) {
        res.status(400).send("Unable to delete")
    }
});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body

    try{
        const ALLOWED_UPDATES = [
            "age",
            "photoUrl",
            "gender",
            "about",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        const updateduser = await User.findByIdAndUpdate(userId, data);
        runValidators: true;
        res.send("User updated successfully")

        if(!updateduser){
            res.status(404).send("No user found")
        }

        if(data?.skills.length > 10){
            throw new Error("Skills exceeded 10")
        }
    }
    catch (err) {
        res.status(400).send("oops something went wrong!"+ err.message)
    }
})

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
});

app.post("/sendConnectionRequest",userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending connection request");

    res.send(user.firstName + "sent Connection request");
})

connectDB().then(() => {
    console.log("Database connection establisheed successfully....");
    app.listen(3000, () => {
        console.log("server is listening on port 3000");
    });
}).catch((err) => {
    console.error("Database conection failed!!!");
    console.error(err);
})