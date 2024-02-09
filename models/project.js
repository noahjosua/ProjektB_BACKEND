const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    team: { type: [String], required: true },
    techStack: { type: [String], required: true },
    repositoryUrl: { type: String, required: false },
    description: { type: String, required: true },
    imagesPaths: { type: [String], required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}); 

module.exports = mongoose.model('Project', projectSchema); 