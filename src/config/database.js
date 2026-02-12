const  mongoose  = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://namastenode:HCTUpbwOlDra1EJS@nodedev.zfdyqq6.mongodb.net/DevTinder",
    );
}


module.exports = {connectDB};