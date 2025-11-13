import Reminder from "../models/Reminder.js";
import Medicine from "../models/Medicine.js";

// Compute next day's occurrence using an existing reminder datetime's HH:mm
const nextDaySameTime = (date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
};

// ======================
// GET ALL REMINDERS
// ======================
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id, status: "pending" })
      .populate("medicineId")
      .sort({ time: 1 });

    res.json(reminders);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// UPDATE REMINDER STATUS
// ======================
export const updateReminderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const reminder = await Reminder.findById(req.params.id).populate("medicineId");
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // Update reminder status
    reminder.status = status;
    await reminder.save();

    // On taken, decrement medicine count but do not go below 0
    if (status === "taken" && reminder.medicineId) {
      const med = await Medicine.findById(reminder.medicineId._id);
      if (med) {
        const newCount = Math.max(0, (med.count || 0) - 1);
        med.count = newCount;
        await med.save();
      }
    }

    res.json(reminder);
  } catch (err) {
    console.error("Error updating reminder status:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// CREATE REMINDER (used by Medicine add)
// ======================
export const createReminder = async (req, res) => {
  try {
    const { medicineId, time } = req.body;

    const reminder = new Reminder({
      userId: req.user.id,
      medicineId,
      time
    });

    await reminder.save();
    res.json(reminder);
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// REMINDER STATS FOR TODAY
// ======================
export const getReminderStats = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const baseFilter = { userId: req.user.id, time: { $gte: start, $lte: end } };
    const [pending, taken, ignored] = await Promise.all([
      Reminder.countDocuments({ ...baseFilter, status: "pending" }),
      Reminder.countDocuments({ ...baseFilter, status: "taken" }),
      Reminder.countDocuments({ ...baseFilter, status: "ignored" }),
    ]);
    const total = pending + taken + ignored;
    res.json({ pending, taken, ignored, total, date: start.toISOString().slice(0,10) });
  } catch (err) {
    console.error("Error getting reminder stats:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
