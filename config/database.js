const mongoose = require("mongoose")

require("dotenv").config()

const {MONGO_URL} = process.env

exports.dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection error:", error)
    }
}