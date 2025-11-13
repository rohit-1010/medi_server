import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  duration: String,
  count: Number,
  times: [{ type: String }],
  intake: String, // pre or post
  description: String,
  startDate: { type: Date },
  endDate: { type: Date },
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Medicine", medicineSchema);
