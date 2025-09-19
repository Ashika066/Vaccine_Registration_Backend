import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  doseType: { type: String, enum: ["firstDose", "secondDose"], required: true },
  capacity: { type: Number, default: 10 },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;