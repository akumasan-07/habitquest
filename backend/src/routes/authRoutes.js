import express from "express";
import { getMe, login, register, deleteAccount } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.delete("/account", authMiddleware, deleteAccount);

export default router;