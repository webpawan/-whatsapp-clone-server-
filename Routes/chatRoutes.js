import express from "express";
import {
  accessChat,
  addGroup,
  createGroupChat,
  fetchChats,
  removeGroup,
  renameGroup,
} from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, accessChat);
router.get("/", verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat);
router.put("/rename", verifyToken, renameGroup);
router.put("/groupadd", verifyToken, addGroup);
router.put("/groupremove", verifyToken, removeGroup);

export default router;
