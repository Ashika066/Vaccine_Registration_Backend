import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Slot from "../models/Slot.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get users with optional filters age, pincode, vaccinationStatus
export const getUsers = async (req, res) => {
  try {
    const { age, pincode, vaccinationStatus } = req.query;
    const filter = {};
    if (age) filter.age = Number(age);
    if (pincode) filter.pincode = pincode;
    if (vaccinationStatus) filter.vaccinationStatus = vaccinationStatus;

    const users = await User.find(filter).select("-password -__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get registered slots count for firstDose, secondDose and total on a given day
export const getSlotsReport = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date query param is required (YYYY-MM-DD)" });

    const dayStart = new Date(date + "T00:00:00.000Z");
    const dayEnd = new Date(date + "T23:59:59.999Z");

    // Count registered users by dose for slots on the date
    const firstDoseSlots = await Slot.find({
      doseType: "firstDose",
      date: { $gte: dayStart, $lt: dayEnd },
    });

    const secondDoseSlots = await Slot.find({
      doseType: "secondDose",
      date: { $gte: dayStart, $lt: dayEnd },
    });

    const firstDoseCount = firstDoseSlots.reduce((sum, slot) => sum + slot.registeredUsers.length, 0);
    const secondDoseCount = secondDoseSlots.reduce((sum, slot) => sum + slot.registeredUsers.length, 0);
    const totalCount = firstDoseCount + secondDoseCount;

    res.json({ date, firstDoseCount, secondDoseCount, totalCount });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
