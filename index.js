import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
import "./db/connection.js";
import userRouter from "./Routes/userRoutes.js";

app.use(express.json());
app.use("/api/user", userRouter);

// ----------------------------------------------
// yadi usko koi route ni milti ha to bo in niche bali rout me jayga firstbali ma bhi error ke response ni mila to second bale ko dhkega
// isko bad me dhkte ha 
// app.use(notFound)
// app.use(notFound);
// --------------------------------------



app.listen(PORT, () => {
  console.log("start server");
});
