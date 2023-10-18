const mongoose = require('mongoose')
const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    users: { type: [mongoose.types.ObjectId], default: [] },
    owner: { type: mongoose.types.ObjectId, required: true },
}, {
    timestamps: true
})

const TeamModel = mongoose.model('team', TeamSchema)
module.exports = { TeamModel }