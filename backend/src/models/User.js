import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 30,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
        },

        timeZone: {
            type: String,
            default: "Asia/Kolkata",
        },
    },

    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;