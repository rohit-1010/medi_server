import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import User from "../models/User.js";
import Medicine from "../models/Medicine.js";
import { sendReminderEmail } from "../utils/emailService.js";

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  // Auto-complete medicines whose endDate has passed
  try {
    await Medicine.updateMany(
      { endDate: { $lte: now }, completed: { $ne: true } },
      { $set: { completed: true } }
    );
  } catch (e) {
    console.error("Auto-complete update failed", e);
  }

  // Find active medicines and compute today's occurrences
  const meds = await Medicine.find({
    completed: false,
    $or: [
      { endDate: { $gt: now } },
      { endDate: { $exists: false } }
    ],
  }).populate("userId");

  for (const med of meds) {
    const times = Array.isArray(med.times) ? med.times : [];
    for (const hhmm of times) {
      const [h, m] = String(hhmm || "").split(":").map((n) => parseInt(n, 10));
      if (!Number.isFinite(h) || !Number.isFinite(m)) continue;

      const occurrence = new Date(now);
      occurrence.setSeconds(0, 0);
      occurrence.setHours(h, m, 0, 0);
      if (occurrence <= now) {
        // Occurrence today already passed; schedule for tomorrow
        occurrence.setDate(occurrence.getDate() + 1);
      }

      const diff = occurrence.getTime() - now.getTime();
      // If within 5 minutes window (in the future)
      if (diff > 0 && diff <= 5 * 60 * 1000) {
        // Idempotency: if a reminder for this exact occurrence already exists, skip sending email again
        const existing = await Reminder.findOne({
          userId: med.userId._id,
          medicineId: med._id,
          time: occurrence,
        });
        if (existing) continue;

        const localTime = occurrence.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        sendReminderEmail(
          med.userId.email,
          "Medicine Reminder ⏰",
          `Hi ${med.userId.name}, it's almost time to take your medicine: ${med.name}. Please take it ${med.intake}-food at ${localTime}.`
        );
        console.log(`Reminder email sent to ${med.userId.email} for ${med.name} at ${localTime}`);

        // Immediately after email, create the pending reminder for this occurrence
        const r = new Reminder({
          userId: med.userId._id,
          medicineId: med._id,
          time: occurrence,
          status: "pending",
        });
        await r.save();
      }
    }
  }
});
