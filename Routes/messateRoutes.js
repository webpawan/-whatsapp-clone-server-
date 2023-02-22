import express from "express"
import { allMessages, sendMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

router.post("/",verifyToken,sendMessage)
router.get("/:chatId", verifyToken,allMessages);

export default router