import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";

export const register = async (req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message: "All fields are required!",
            });
        }

        const existingUser = await User.findOne({
            $or: [{username}, {email}],
        });

        if(existingUser){
            return res.status(400).json({
                message: "Username or Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
        });

    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


export const login = async (req, res) => {
    try{
        const {identifier, password} = req.body;

        if(!identifier || !password){
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({
            $or: [
                {email: identifier},
                {username: identifier},
            ],
        });

        if(!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { userId: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


export const getMe = async (req, res) => {
    try { 
        const user = await User.findById(req.user.userId).select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


export const deleteAccount = async (req, res) => {
    try{
        const { password } = req.body;
        if(!password){
            return res.status(400).json({
                message: "Password is required!",
            });
        }

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({
                message: "User not found!",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!isMatch){
            return res.status(401).json({
                message: "Incorrect password",
            });
        }

        await QuestLog.deleteMany({
            userId: req.user.userId,
        });

        await Quest.deleteMany({
            userId: req.user.userId,
        });

        await User.findByIdAndDelete(
            req.user.userId
        );

        res.status(200).json({
            message: "Account deleted successfully",
        });

    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};