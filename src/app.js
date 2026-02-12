const express = require('express');

const {adminAuth} = require('./middlewares/auth');
const app = express();


app.get("/user", (req,res) => {
    try{
        throw new Error("ABCD");
        res.send("User datasend");
    }
    catch (err) {
        res.status(500).send("something went wrong!!!");
    }
})


app.use("/", (err, req, res, next) => {
    if (err) {
    res.status(500).send("Server failed");
    }
});

app.use("/admin", adminAuth);

app.use("/hello/ola", (req, res) => {
    res.send('you are on hello')
})

app.use("/admin/update", (req,res) => {
    res.send('you are on admin update')
})

app.use("/hello/test", (req,res) => {
    res.send('you are on test')
})


app.listen(3000, () => {
    console.log('server is listening on port 3000');
})