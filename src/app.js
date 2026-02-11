const express = require('express');

const {adminAuth} = require('./middlewares/auth');
const app = express();

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

app.use("/", (req, res) => {
    res.send("hello from server");
});

app.listen(3000, () => {
    console.log('server is listening on port 3000');
})