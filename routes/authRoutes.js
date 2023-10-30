import express from "express";
import { register, login, loginPin } from "../controllers/authController.js";
import upload from "../middlewares/subirImagen.js";

const router = express.Router();

router.post("/register", upload.single("imagen"), register);

router.post("/login", login);
router.post("/login-pin", loginPin);

export default router;
