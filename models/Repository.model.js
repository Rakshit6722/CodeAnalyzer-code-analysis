const { default: mongoose } = require("mongoose");

const repositorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    repoName:{
        type: String,
        required:true,
    },
    repoUrl:{
        type: String,
        required:true,
    },
    branch:{
        type: String,
        default:"main"
    },
    commitHash:{
        type: String
    },
    lastSync:{
        type: Date,
        default: Date.now
    },

},{
    timestamps: true,
})

module.exports = mongoose.model('Repository', repositorySchema);