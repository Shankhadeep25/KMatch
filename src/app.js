const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user');

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

app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body

    try{
        const updateduser = await User.findOneAndUpdate({emailId : emailId}, data);
        res.send("User updated successfully")

        if(!updateduser){
            res.status(404).send("No user found")
        }
    }
    catch (err) {
        res.status(400).send("oops something went wrong!")
    }
})

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

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