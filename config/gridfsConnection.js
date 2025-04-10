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

    console.log("MongoDB connected for GridFS");

    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    })
    console.log("GridFS connected")
})

const getGFS = () => {
  if (!gfs) {
    throw new Error("GridFS not initialized yet");
  }
  return gfs;
};



module.exports = {
    getGFS,
    conn,
}