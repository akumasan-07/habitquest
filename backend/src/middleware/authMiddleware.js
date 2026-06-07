import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { DEFAULT_TIMEZONE } from "../utils/dateUtils.js";

const authMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("timeZone").lean();
        if(!user) {
            return res.status(401).json({
                message: "Access denied",
            });
        }

        req.user = {
            userId: decoded.userId,
            timeZone: user.timeZone || DEFAULT_TIMEZONE,
        };
        next();
    } catch(error){
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};

export default authMiddleware;
