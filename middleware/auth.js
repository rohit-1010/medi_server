import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/constants.js";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains user id
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
