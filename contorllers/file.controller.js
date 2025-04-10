const { saveFileMetaData, getFileStream, deleteFile } = require("../services/file.service")
const CodeFile = require('../models/CodeFile.model')
const streamifier = require("streamifier");
const { getGFS } = require("../config/gridfsConnection");
const mongoose = require("mongoose")


exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const gfs = getGFS()

        const { repoId, language } = req.body;
        const { userId } = req;

        const { originalname, buffer, mimetype } = req.file;

        if (!userId || !language) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        /**
         * creates a write stream to upload file to mongoDB gridfs
         */
        const uploadStream = gfs.openUploadStream(originalname, {
            contentType: mimetype,
        });

        /**
         * streamifier creates a readable stream from the buffer and pipes it to the upload stream
         * The upload stream is then saved to the database
         */
        streamifier.createReadStream(buffer).pipe(uploadStream)
            .on("error", (err) => {
                console.error("Upload stream error:", err);
                res.status(500).json({ message: "Upload failed", error: err.message });
            })
            .on("finish", async () => {
                try {
                    const fileId = uploadStream.id;

                    const savedFile = await saveFileMetaData(
                        {
                            fileName: originalname,
                            id: fileId,
                        },
                        {
                            userId,
                            repoId,
                            language,
                        }
                    );

                    res.status(201).json({
                        message: "File uploaded successfully",
                        file: savedFile,
                    });
                } catch (saveErr) {
                    console.error("Metadata save error:", saveErr);
                    res.status(500).json({ message: "Metadata save failed", error: saveErr.message });
                }
            });

    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected error", error: err.message });
    }
};

exports.getFile = async (req, res) => {
    try {
        const fileId = req.params.id
        
        console.log("File ID:", fileId)

        const metaData = await CodeFile.findOne({ _id: new mongoose.Types.ObjectId(fileId) })

        console.log("MetaData:", metaData)

        if (!metaData) {
            return res.status(404).json({
                message: "File not found"
            })
        }

        res.setHeader("Content-Description", `attachment; filename=${metaData.filename}`)
        res.setHeader("Content-Type", "application/octet-stream")
        res.setHeader("X-File-Language", metaData.language)
        if(metaData.repoId) {
            res.setHeader("X-File-RepoId", metaData.repoId.toString())
        }
        res.setHeader("X-File-UserId", metaData.userId.toString())

        const fileStream = await getFileStream(metaData.fileId)
        fileStream
            .on("error", (err) => {
                console.error(" GridFS download error:", err.message);
                return res.status(404).json({ message: "File not found or deleted" });
            })
            .pipe(res);
    } catch (err) {
        res.status(500).json({
            message: "Error getting file",
            error: err.message
        })
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        await deleteFile(fileId);
        res.status(200).json({ message: "File deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
};