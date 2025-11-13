import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../constants/constants.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export const sendReminderEmail = (to, subject, text) => {
  transporter.sendMail({ from: EMAIL_USER, to, subject, text }, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Email sent:", info.response);
  });
};
