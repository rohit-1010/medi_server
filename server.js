import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import { PORT } from "./constants/constants.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import "./jobs/reminderJob.js"; // ✅ Start reminder scheduler
import reminderRouter from "./routes/reminderRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
connectDB();

app.use(cors("*"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Medication Reminder API is running...");
});
app.use("/api/auth", authRouter);
app.use("/api/medicines", medicineRoutes);
app.use("/api/reminders", reminderRouter); // ✅ Added reminders route

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
