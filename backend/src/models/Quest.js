import mongoose from "mongoose";

const questSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title:{
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
    },
    {
        timestamps: true,
    }
);

const Quest = mongoose.model("Quest", questSchema);

export default Quest;