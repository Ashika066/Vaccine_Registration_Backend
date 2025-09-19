import express from "express";
import { adminLogin, getUsers, getSlotsReport } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", adminAuthMiddleware, getUsers);
router.get("/slots/report", adminAuthMiddleware, getSlotsReport);

export default router;
