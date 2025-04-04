import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogs_management";

const dbconnection = async() => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        if (connection) {
            console.log("MongoDB Connected Successfully!");
        }
    } catch (error) {
        console.error(error.message);
    }
}

export default dbconnection;