import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import bcryptjs from "bcryptjs";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      req.status(400);
      throw Error("please enter all fields");
    }
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      res.status(400);
      throw Error("user already exit");
    }
    const newUser = await User({
      name: name,
      email: email,
      password: password,
      pic: pic,
    });

    if (newUser) {
      const token = await newUser.genrateToken();

      res.cookie("jwt", token, {
      
        httpOnly: true,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } else {
      res.status(400);
      throw new Error("Failed to singin user");
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(404).json("email and password are invalid");
    }

    const loginUser = await User.findOne({ email: email });
    if (loginUser) {
      const isMatch = await bcryptjs.compare(password, loginUser.password);
     
      if (isMatch) {
         const token = await loginUser.genrateToken();
         res.cookie("jwt", token, {
           httpOnly: true,
         });
        return res.status(200).json(loginUser);

      } else {
        return res.status(404).json("invalid user crenditials");

      }
    } else {
      res.status(404).json("some problem in login api");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json("login catch error");
  }
};



export const allUsers = asyncHandler(async (req, res, next) => {
 
  const keyword = req.query.search
    ? {
       
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};


  const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
  res.send(users);
  
});
