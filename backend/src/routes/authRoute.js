import express from "express";
import { forgotPassword, loginUser, logoutUser, refresh, registerUser, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)
router.post("refresh", refresh)
router.post("/logout", logoutUser)

export default router;
