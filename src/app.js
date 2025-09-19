import express from "express";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(express.json());

// for user
app.use("/api/user", userRoutes);

// for admin
app.use("/api/admin", adminRoutes);

export default app;