const { UserModel } = require("../../models/user.model");
const { createLinkForFiles } = require("../../modules/functions")

class UserController {
    getProfile(req, res, next) {
        try {
            const user = req.user
            user.profileImage = createLinkForFiles(user.profileImage, req)
            return res.status(200).json({
                status: 200,
                success: true,
                user
            })
        } catch (error) {
            next(error)
        }
    }

    async editProfile(req, res, next) {
        try {
            const data = req.body
            const userId = req.user._id
            let fields = ["firstName", "lastName", "skills"]
            let badValue = ["", " ", null, undefined, 0, -1, NaN, [], {}]
            Object.entries(data).forEach(([key, value]) => {
                if (!fields.includes(key)) delete data[key]
                if (badValue.includes(value)) delete data[key]
            })
            const result = await UserModel.updateOne({ _id: userId }, { $set: data })
            if (result.modifiedCount > 0) {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'به روز رسانی پروفایل انجام شد'
                })
            }
            throw { status: 400, message: 'به روز رسانی پروفایل انجام نشد' }
        } catch (error) {
            next(error)
        }
    }

    async uploadProfileImage(req, res, next) {
        try {
            const userId = req.user._id
            const filePath = req.file?.path
            console.log(filePath);
            const result = await UserModel.updateOne({ _id: userId }, { $set: { profileImage: filePath } })
            if (result.modifiedCount == 0) throw { status: 400, message: 'به روزرسانی انجام نشد' }
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'به روز رسانی با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    addSkills() { }
    editSkills() { }
    acceptInviteTeam() { }
    rejectInviteTeam() { }
}

module.exports = {
    UserController: new UserController()
}