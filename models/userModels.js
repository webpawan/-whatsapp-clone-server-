import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=is&k=20&c=I2SanirjQN_dCkpeSoGEvbffSnkGQSwIEwpqQP9AR8I=",
  },
  tokens:[
    {
      token:{
        type:String,
        required:true
        
      }
    }
  ]
});

userSchema.methods.genrateToken = async function () {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_KEY,{expiresIn:'5h'});
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
    res.status(404).json("jwt token problem");
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
