import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    pincode: { type: String, required: true },
    aadhaarNo: { type: String, required: true },
    vaccinationStatus: { 
        type: String, 
        enum: ["none", "firstDoseDone", "fullyVaccinated"], 
        default: "none" 
    },
    firstDoseSlot: { type: Date },  // date and time of first dose slot
    secondDoseSlot: { type: Date }, // date and time of second dose slot
    firstDoseVaccinatedAt: { type: Date },
    secondDoseVaccinatedAt: { type: Date }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
