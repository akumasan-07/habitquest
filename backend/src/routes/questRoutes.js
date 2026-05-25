import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createQuest, deleteQuest, getQuests, renameQuest } from "../controllers/questController.js";

const router =  express.Router();

router.use(authMiddleware);

router.route("/").post(createQuest).get(getQuests);
router.route("/:id").patch(renameQuest).delete(deleteQuest);

export default router;