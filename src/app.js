const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')

const {adminAuth} = require('./middlewares/auth');
const app = express();

app.use(express.json());


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

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid) {
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

connectDB().then(() => {
    console.log("Database connection establisheed successfully....");
    app.listen(3000, () => {
        console.log("server is listening on port 3000");
    });
}).catch((err) => {
    console.error("Database conection failed!!!");
    console.error(err);
})