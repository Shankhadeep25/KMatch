const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, maxLength: 20 },
    lastName: { type: String, required: true },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      // validate(value) {
      //   if(!validator.isStrongPassword(value)){
      //     throw new Error("Enter a strong password" + value);
      //   }
      // }
    },
    age: { type: Number, min: 18 },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    skills: { type: [String] },
    about: {
      type: String,
      default: "This is default about user!",
    },
  },
  { timestamps: true },
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  
  const token =  await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn: "7d"})

  return token;
}

UserSchema.methods.validatePassword = async function (passwordInputUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputUser, passwordHash);

  return isPasswordValid;
}


module.exports = mongoose.model("User", UserSchema);