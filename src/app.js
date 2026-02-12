const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user')

const {adminAuth} = require('./middlewares/auth');
const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName : "Satakshi",
        lastName : "Roy",
        emailId : "isha@gmail.com",
        password : "456@gt"
    });

    try{
        await user.save();
        res.send("User Added successfully!")
    }
    catch (err) {
        res.status(400).send("Error saving the user" + err.message)
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