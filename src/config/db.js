import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;