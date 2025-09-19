import User from "../models/User.js";
import Slot from "../models/Slot.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new User
export const registerUser = async (req, res) => {
    try {
        const { name, phoneNumber, password, age, pincode, aadhaarNo } = req.body;
        if (!name || !phoneNumber || !password || !age || !pincode || !aadhaarNo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phoneNumber, password: hashedPassword, age, pincode, aadhaarNo });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password required" });
        }

        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });
    } catch (err) {
        console.error("Login error details:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get available vaccination slots for the user based on vaccination status
export const getAvailableSlots = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.vaccinationStatus === "fullyVaccinated") {
      return res.json({ message: "You are fully vaccinated" });
    }

    let doseType = "firstDose";
    if (user.vaccinationStatus === "firstDoseDone") doseType = "secondDose";

    const slots = await Slot.find({
      doseType,
      date: { $gte: new Date("2024-11-01T10:00:00Z"), $lt: new Date("2024-11-30T17:00:00Z") },
      $expr: { $lt: [{ $size: "$registeredUsers" }, "$capacity"] },
    }).sort("date");

    res.json({ doseType, availableSlots: slots });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register user to a chosen slot after validations
export const registerSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    if (!slotId) return res.status(400).json({ message: "Slot ID is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.registeredUsers.length >= slot.capacity) {
      return res.status(400).json({ message: "This slot is full" });
    }

    if (slot.doseType === "secondDose" && user.vaccinationStatus !== "firstDoseDone") {
      return res.status(400).json({ message: "Cannot book second dose without first dose completion" });
    }
    if (slot.doseType === "firstDose" && user.vaccinationStatus !== "none") {
      return res.status(400).json({ message: "First dose already registered or completed" });
    }

    // Remove user from existing slot for doseType
    await Slot.updateMany(
      { doseType: slot.doseType },
      { $pull: { registeredUsers: user._id } }
    );

    slot.registeredUsers.push(user._id);
    await slot.save();

    if (slot.doseType === "firstDose") user.firstDoseSlot = slot.date;
    else user.secondDoseSlot = slot.date;

    await user.save();

    res.json({ message: `Registered for ${slot.doseType} on ${slot.date}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update/change slot (allowed till 24 hours prior)
export const updateSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    if (!slotId) return res.status(400).json({ message: "Slot ID is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newSlot = await Slot.findById(slotId);
    if (!newSlot) return res.status(404).json({ message: "Slot not found" });

    // Determine which dose slot user wants to update
    let doseType = user.vaccinationStatus === "none" ? "firstDose" :
                   user.vaccinationStatus === "firstDoseDone" ? "secondDose" : null;

    if (!doseType) {
      return res.status(400).json({ message: "Fully vaccinated users can't update slots" });
    }

    // Check current slot for the dose
    const currentSlotDate = doseType === "firstDose" ? user.firstDoseSlot : user.secondDoseSlot;
    if (!currentSlotDate) {
      return res.status(400).json({ message: "No existing slot to update" });
    }

    // Check time difference to ensure update allowed (24 hours prior)
    const now = new Date();
    const currentSlotTime = new Date(currentSlotDate);
    if ((currentSlotTime.getTime() - now.getTime()) < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "Cannot update slot within 24 hours of slot time" });
    }

    // Check new slot capacity
    if (newSlot.registeredUsers.length >= newSlot.capacity) {
      return res.status(400).json({ message: "New slot is full" });
    }

    if (newSlot.doseType !== doseType) {
      return res.status(400).json({ message: `Slot dose type mismatch. Expected: ${doseType}` });
    }

    // Remove user from old slot
    await Slot.updateOne(
      { date: currentSlotDate, doseType },
      { $pull: { registeredUsers: user._id } }
    );

    // Add user to new slot
    newSlot.registeredUsers.push(user._id);
    await newSlot.save();

    // Update user’s slot date field
    if (doseType === "firstDose") user.firstDoseSlot = newSlot.date;
    else user.secondDoseSlot = newSlot.date;

    await user.save();

    res.json({ message: `Slot updated successfully to ${newSlot.date}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
