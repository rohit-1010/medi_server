import Medicine from "../models/Medicine.js";
import Reminder from "../models/Reminder.js";

// Parse HH:mm to next Date occurrence (today or tomorrow)
const nextOccurrenceFromHHmm = (hhmm) => {
  const [h, m] = String(hhmm || "").split(":").map((n) => parseInt(n, 10));
  const now = new Date();
  const next = new Date(now);
  next.setSeconds(0, 0);
  next.setHours(Number.isFinite(h) ? h : 8, Number.isFinite(m) ? m : 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next;
};

export const addMedicine = async (req, res) => {
  // Normalize inputs
  const now = new Date();
  const durationDays = Number(req.body.duration) || 0;
  const startDate = now;
  const endDate = new Date(startDate);
  if (durationDays > 0) endDate.setDate(endDate.getDate() + durationDays);

  const times = Array.isArray(req.body.times)
    ? req.body.times.filter(Boolean)
    : (req.body.time ? [req.body.time] : []);

  const med = new Medicine({
    userId: req.user.id,
    name: req.body.name,
    duration: String(req.body.duration ?? ""),
    count: typeof req.body.count === "number" ? req.body.count : Number(req.body.count) || 0,
    times,
    intake: req.body.intake,
    description: req.body.description,
    startDate,
    endDate: durationDays > 0 ? endDate : undefined,
    completed: false,
  });
  await med.save();

  // Do not create reminders now; cron will create a reminder immediately after sending email
  res.json({ med });
};

export const getMedicines = async (req, res) => {
  const now = new Date();
  // Auto-mark completed when endDate has passed
  await Medicine.updateMany(
    { userId: req.user.id, endDate: { $lte: now } },
    { $set: { completed: true } }
  );

  const filter = { userId: req.user.id };
  const status = (req.query.status || '').toString().toLowerCase();
  if (status === 'active') {
    filter.completed = false;
    filter.$or = [
      { endDate: { $gt: now } },
      { endDate: { $exists: false } }
    ];
  } else if (status === 'completed') {
    filter.$or = [
      { completed: true },
      { endDate: { $lte: now } }
    ];
  }

  const meds = await Medicine.find(filter);
  res.json(meds);
};

export const markCompleted = async (req, res) => {
  const med = await Medicine.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
  res.json(med);
};




