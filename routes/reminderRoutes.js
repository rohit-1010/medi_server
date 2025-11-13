import express from "express";
import { getReminders, updateReminderStatus, createReminder, getReminderStats } from "../controllers/reminderController.js";
import { auth } from "../middleware/auth.js";

const reminderRouter = express.Router();

// Get all reminders for logged-in user
reminderRouter.get("/", auth, getReminders);

// Update reminder status (taken / ignored)
reminderRouter.put("/:id", auth, updateReminderStatus);

// Create reminder (optional – if you auto-create reminders when adding medicine)
reminderRouter.post("/", auth, createReminder);

// Stats for today
reminderRouter.get("/stats", auth, getReminderStats);

export default reminderRouter;
