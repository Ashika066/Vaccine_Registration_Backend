import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../src/models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const password = "adminpass";  // give random admin password (can change manually)
    const hashedPassword = await bcrypt.hash(password, 10);

    // create an admin user with hashed password
    const admin = new Admin({
      username: "admin", // give random admin username (can change manually)
      password: hashedPassword,
    });

    // save admin user to database
    await admin.save();

    console.log("Admin user created");

    // Disconnect from database after creation (as we created only 1 admin)
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
