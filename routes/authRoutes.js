import express from "express";
import { register, login, loginPin } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.post("/login-pin", loginPin);

export default router;
