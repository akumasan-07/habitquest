import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getHeatmapData, getQuestAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/heatmap", getHeatmapData);
router.get("/quests", getQuestAnalytics);

export default router;