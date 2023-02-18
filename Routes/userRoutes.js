import Express from "express";
import { login, registerUser } from "../controllers/userControllers.js";
import { verifyToken } from "../verifyToken.js";
const router = Express.Router();

router.post("/register", registerUser);
router.post("/login",login);

export default router;
