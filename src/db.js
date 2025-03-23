const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.WEB_DATABASE_URL, {
            serverSelectionTimeoutMS: 5000, // Giữ timeout để tránh treo kết nối
        });
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
    }
}

module.exports = { connectDB };
