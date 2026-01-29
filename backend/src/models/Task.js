import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    due: { type: String, default: "Today" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
