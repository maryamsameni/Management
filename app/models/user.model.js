const mongoose = require('mongoose')
const InviteRequest = new mongoose.Schema({
    teamId: { type: mongoose.Types.ObjectId, required: true },
    caller: { type: String, required: true, lowercase: true },
    requestDate: { type: Date, default: new Date() },
    status: { type: String, default: 'pending' } //pending, accepted, rejected
})
const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, lowercase: true },
    skills: { type: [String], default: [] },
    teams: { type: [mongoose.Types.ObjectId], default: [] },
    roles: { type: [String], default: ["USER"] },
    token: { type: String, default: "" },
    profileImage: { type: String },
    inviteRequest: { type: [InviteRequest] }
}, {
    timestamps: true
})

const UserModel = mongoose.model('user', UserSchema)
module.exports = { UserModel }