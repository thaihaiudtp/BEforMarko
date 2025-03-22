const mongoose = require('mongoose')
async function connectDB() {
    try {
        await mongoose.connect(process.env.WEB_DATABASE_URL)
        console.log("ok!")
    } catch (error) {
        console.log(error);
    }
}
module.exports = {connectDB}