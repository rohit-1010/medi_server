import express from "express";
import { addMedicine, getMedicines, markCompleted } from "../controllers/medicineController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/", auth, addMedicine);
router.get("/", auth, getMedicines);
router.put("/:id", auth, markCompleted);

export default router;
