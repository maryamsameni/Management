const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String },
    image: { type: String, default: "/defaults/default.png" },
    team: { type: mongoose.Types.ObjectId },
    private: { type: Boolean, default: true },
    owner: { type: mongoose.Types.ObjectId, required: true },
    tags: { type: [String], default: [] }

}, {
    timestamps: true
})

const ProjectModel = mongoose.model('project', ProjectSchema)
module.exports = { ProjectModel }