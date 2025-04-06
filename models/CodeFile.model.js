const mongoose = require('mongoose');

const codeFileSchema = new mongoose.Schema({
    filename:{
        type: String,
        required: true,
    },
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"fs.files"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    repoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository',
        required: false,
    },
    language:{
        type: String,
        required: true,
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('CodeFile', codeFileSchema);