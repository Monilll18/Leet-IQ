import mongoose from "mongoose";
import { env } from "../lib/env.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.DB_URL);
        console.log("✅ Connected to MongoDB:", conn.connection.host);
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        process.exit(1); // 1 is fail, 0 is success
    }
};

export default connectDB;