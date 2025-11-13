import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/constants.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};
