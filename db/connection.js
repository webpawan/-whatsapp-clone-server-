import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("successfull connect");
}).catch((e)=>{
    console.log("data base not connected" + e);
})