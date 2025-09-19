import cron from "node-cron";
import User from "../models/User.js";

// Runs every hour
const updateVaccinationStatusJob = cron.schedule("0 * * * *", async () => {
  const now = new Date();

  try {
    // Update users who passed first dose slot but still have status 'none'
    const firstDoseUsers = await User.find({
      vaccinationStatus: "none",
      firstDoseSlot: { $lte: now }
    });

    for (const user of firstDoseUsers) {
      user.vaccinationStatus = "firstDoseDone";
      user.firstDoseVaccinatedAt = user.firstDoseSlot;
      await user.save();
      console.log(`User ${user.phoneNumber} marked as firstDoseDone`);
    }

    // Update users who passed second dose slot but still have status 'firstDoseDone'
    const secondDoseUsers = await User.find({
      vaccinationStatus: "firstDoseDone",
      secondDoseSlot: { $lte: now }
    });

    for (const user of secondDoseUsers) {
      user.vaccinationStatus = "fullyVaccinated";
      user.secondDoseVaccinatedAt = user.secondDoseSlot;
      await user.save();
      console.log(`User ${user.phoneNumber} marked as fullyVaccinated`);
    }
  } catch (err) {
    console.error("Error updating vaccination status:", err);
  }
}, {
  scheduled: false
});

export default updateVaccinationStatusJob;
