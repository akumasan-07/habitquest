import bcrypt from "bcryptjs";
import User from "../models/User.js";

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