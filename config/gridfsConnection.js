const mongoose = require("mongoose")
const { GridFsStorage } = require("multer-gridfs-storage")
require("dotenv").config()

const mongoURL = process.env.MONGO_GRIDFS_URL

const conn = mongoose.createConnection(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let gfs
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    })
    console.log("GridFS connected")
})

const storage = new GridFsStorage({
    url: mongoURL,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: "uploads",
        }
    }
})

module.exports = {
    gfs,
    storage,
    conn,
}