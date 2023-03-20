import Express from "express";
import { allUsers, login, registerUser } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/verifyTokenMiddleware.js";

const router = Express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/",verifyToken,allUsers)
export default router;
