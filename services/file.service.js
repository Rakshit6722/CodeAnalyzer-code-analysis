const ApiError = require('../utils/ApiError');
const CodeFile = require('../models/CodeFile.model');
const { gfs } = require('../config/gridfsConnection')

/**
 * upload file metadata to db
 * @param {Object} file - the uploaded file object (from multer)
 * @param {Object} fileData - additional file metadata (userId, repoId, language)
 * @returns {Object} - Saved metadata
 */

exports.saveFileMetaData = async (file, fileData) => {
    try {
        const newFile = new CodeFile({
            filename: file.fileName,
            fileId: file.id,
            userId: fileData.userId,
            repoId: fileData.repoId,
            language: fileData.language,
        })

        const savedFile = await newFile.save()
        return savedFile
    } catch (err) {
        console.error("Error saving file metadata:", err)
        throw new Error("Error saving file metadata" + err.message)
    }
}

/**
 * Get a file stream from GridFs
 * @param {String} fileId - file ID
 * @returns {String} - readable stream of the file
 */

exports.getFileStream = async (fileId) => {
    try {
        return gfs.openDownloadStream(fileId)
    }catch(err){
        console.error("Error getting file stream:", err)
        throw new Error("Error getting file stream" + err.message)
    }
}

/**
 * Delete a file from GridFS and database
 * @param {String} fileID - file ID
 * @returns {String} - deletion success message
 */

exports.deleteFile = async (fileId) => {
    try{
        await gfs.delete(fileId)
        await CodeFile.findOneAndDelete({fileId})

        return { message: "File deleted successfully" }
    }catch(err){
        console.error("Error deleting file:", err)
        throw new Error("Error deleting file" + err.message)
    }
}