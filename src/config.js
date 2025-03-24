const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const DB_COLLECTION = process.env.DB_COLLECTION;

if (!MONGO_URI || !DB_NAME || !DB_COLLECTION) {
    console.error("Missing environment variables! Check your .env file.");
    process.exit(1);
}

const client = new MongoClient(MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}
connectDB();

module.exports = { client, DB_NAME, DB_COLLECTION };