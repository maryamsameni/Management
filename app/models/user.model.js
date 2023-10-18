const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    skills: { type: [String], default: [] },
    teams: { type: [mongoose.Types.ObjectId], default: [] },
    roles: { type: [String], default: ["USER"] },
    token: { type: String, default: "" }
}, {
    timestamps: true 
})

const UserModel = mongoose.model('user', UserSchema)
module.exports = { UserModel }