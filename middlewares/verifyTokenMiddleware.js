import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

export const verifyToken = async(req, res, next) => {
 try {
     const token = req.cookies.jwt;
     const verifyToken = jwt.verify(token, process.env.JWT_KEY);
     const user = await User.findOne({ _id: verifyToken.id });
     req.token = token;
     req.user = user;
     next();
 } catch (error) {
    console.log(error);
    res.status(400).send("something wrong")
 }
};
