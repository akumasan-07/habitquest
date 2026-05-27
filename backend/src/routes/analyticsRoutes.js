import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getHeatmapData, getStreaks } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/heatmap", getHeatmapData);
router.get("/streaks", getStreaks);

export default router;