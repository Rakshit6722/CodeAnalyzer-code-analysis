const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFile, deleteFile, getAllFile } = require('../contorllers/file.controller')
const { auth } = require('../middlewear/auth.middlewear');
require('dotenv').config()
const GridFsStorage = require('multer-gridfs-storage');

const upload = multer({storage: multer.memoryStorage()})

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/file/:id', auth, getFile)
router.delete('/file/:id', auth, deleteFile)
router.get('/file',auth,getAllFile)

module.exports = router