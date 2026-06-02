import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://habitquest-jet.vercel.app",
    ],
}));
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "HabitQuest API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});