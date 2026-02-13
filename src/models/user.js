const mongoose = require("mongoose")

const validator = require("validator")

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, maxLength: 20 },
  lastName: { type: String,
    required : true,
   },
  emailId: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error("Invalid Email" + value);
      }
    }
  },
  password: { type: String, 
    required: true ,
    validate(value) {
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a strong password" + value);
      }
    }  
  },
  age: { type: Number, min: 18 },
  photoUrl: {
    type: String,
    default: "https://www.freepik.com/free-photos-vectors/default-user",
  },
  gender:  {type: String,
    validate(value) {
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender data not valid!");
        }
    }
  },
  skills: { type: [String] },
  about: {
    type: String,
    default: "This is default about user!",
  },
}, {timestamps: true});


module.exports = mongoose.model("User", UserSchema);