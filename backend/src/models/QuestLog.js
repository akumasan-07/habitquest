import mongoose from "mongoose";

const questLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quest",
    required: true,
  },

  completed: {
    type: Boolean,
    required: true,
    default: true,
  },

  date: {
    type: Date,
    required: true,
  },
});

questLogSchema.index(
  {
    userId: 1,
    questId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

questLogSchema.index({
  userId: 1,
  completed: 1,
});

const QuestLog = mongoose.model("QuestLog", questLogSchema);

export default QuestLog;