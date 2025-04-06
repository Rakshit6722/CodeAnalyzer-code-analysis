const { saveFileMetaData, getFileStream } = require("../services/file.service")
const CodeFile = require('../models/CodeFile.model')

exports.uploadFile = async (req, res) => {
    try {
        const { repoId, language } = req.body
        const { userId } = req
        const fileId = req.file.id
        const fileName = req.file.originalname

        const savedFile = await saveFileMetaData
            ({
                fileName,
                id: fileId
            }, {
                userId,
                repoId,
                language
            })

        res.status(201).json({
            message: "File uploaded successfully",
            file: savedFile
        })
    } catch (err) {
        console.error("Error uploading file:", err)
        res.status(500).json({
            message: "Error uploading file",
            error: err.message
        })
    }
}

exports.getFile = async (req, res) => {
    try{
        const fileId = req.params.id

        const metaData = await CodeFile.findOne({fileId})

        if(!metaData){
            return res.status(404).json({
                message: "File not found"
            })
        }

        res.setHeader("Content-Description", `attachment; filename=${metaData.filename}`)
        res.setHeader("Content-Type", "application/octet-stream")
        res.setHeader("X-FIle-Language", metaData.language)
        res.setHeader("X-File-RepoId", metaData.repoId.toString())
        res.setHeader("X-File-UserId", metaData.userId.toString())

        const fileStream = await getFileStream(fileId)
        fileStream.pipe(res)
    }catch(err){
        res.status(500).json({
            message: "Error getting file",
            error: err.message
        })
    }
}

exports.deleteFile = async (req, res) => {
    try {
      const fileId = req.params.id;
      await FileService.deleteFile(fileId);
      res.status(200).json({ message: "File deleted" });
    } catch (error) {
      res.status(500).json({ error: "Delete failed" });
    }
  };