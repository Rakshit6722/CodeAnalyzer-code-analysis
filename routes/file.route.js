const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFile, deleteFile} = require('../contorllers/file.controller')
const { storage } = require('../config/gridfsConnection');
const { auth } = require('../middlewear/auth.middlewear');

const upload = multer({ storage })

router.post('/upload', auth, upload.single("file"), uploadFile)
router.get('/file/:id', getFile)
router.delete('/file/:id', deleteFile)

module.exports = router