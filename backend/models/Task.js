import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed_request", "completed"],
    default: "pending"
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false
  }
});


export default mongoose.model("Task", taskSchema);
