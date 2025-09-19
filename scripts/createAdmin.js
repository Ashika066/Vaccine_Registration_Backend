import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../src/models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const password = "adminpass";  // give random admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username: "admin", // give random admin username
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin user created");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
