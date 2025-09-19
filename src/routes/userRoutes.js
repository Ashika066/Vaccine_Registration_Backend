import express from "express";
import {
  registerUser,
  loginUser,
  getAvailableSlots,
  registerSlot,
  updateSlot,
} from "../controllers/UserController.js";
import { userAuthMiddleware } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/slots", userAuthMiddleware, getAvailableSlots);
router.post("/slots/register", userAuthMiddleware, registerSlot);
router.put("/slots/update", userAuthMiddleware, updateSlot);

export default router;
