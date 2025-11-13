import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  time: Date,
  status: { type: String, enum: ["pending", "taken", "ignored"], default: "pending" },
});

export default mongoose.model("Reminder", reminderSchema);
