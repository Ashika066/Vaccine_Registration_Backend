import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import updateVaccinationStatusJob from "./jobs/vaccinationStatusUpdater.js";

const port = process.env.PORT || 8000;

const startServer = async () => {
    await connectDB();
    
    updateVaccinationStatusJob.start();

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

startServer();