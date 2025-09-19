import mongoose from "mongoose";
import dotenv from "dotenv";
import Slot from "../src/models/Slot.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const generateSlots = async () => {
  try {
    const startDate = new Date("2024-11-01T10:00:00Z");
    const endDate = new Date("2024-11-30T17:00:00Z");

    const slots = [];
    for (
      let day = startDate;
      day <= endDate;
      day.setUTCDate(day.getUTCDate() + 1)
    ) {
      for (let hour = 10; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(
            Date.UTC(
              day.getUTCFullYear(),
              day.getUTCMonth(),
              day.getUTCDate(),
              hour,
              minute
            )
          );

          slots.push({ date: slotStart, doseType: "firstDose", capacity: 10 });
          slots.push({ date: slotStart, doseType: "secondDose", capacity: 10 });
        }
      }
    }

    await Slot.deleteMany({});
    console.log("Old slots cleared");

    await Slot.insertMany(slots);
    console.log("Slots populated:", slots.length);
  } catch (err) {
    console.error("Error populating slots:", err.message);
  } finally {
    process.exit(0);
  }
};

connectDB().then(() => generateSlots());
