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

    async getAllRequest(req, res, next) {
        try {
            const userId = req.user._id
            // const { inviteRequest } = await UserModel.findOne(
            //     { _id: userId }, { inviteRequest: 1 })
            const inviteRequest  = await UserModel.aggregate([
                {
                    $match: { _id: userId }
                }, {
                    $project: { inviteRequest: 1 }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "inviteRequest.caller",
                        foreignField: "userName",
                        as: "callerInfo"
                    }
                }
            ])
            return res.status(200).json({
                status: 200,
                success: true,
                requsets: inviteRequest
            })
        } catch (error) {
            console.log(error.message);
            next(error.message)
        }
    }

    async getRequestByStatus(req, res, next) {
        try {
            const { status } = req.params
            const userId = req.user._id
            const requests = await UserModel.aggregate([
                { $match: { _id: userId } },
                {
                    $project: {
                        inviteRequest: 1,
                        _id: 0,
                        inviteRequest: {
                            $filter: {
                                input: "$inviteRequest",
                                as: "request",
                                cond: {
                                    $eq: ["$$request.status", status]
                                }
                            }
                        }
                    }
                }
            ])
            return res.status(200).json({
                status: 200,
                success: true,
                requests: requests?.[0]?.inviteRequest || []
            })
        } catch (error) {
            next(error)
        }
    }

    async changeStatusRequest(req, res, next) {
        try {
            const { id, status } = req.params
            const request = await UserModel.findOne({ "inviteRequest._id": id })
            if (!request) throw { status: 404, message: "درخواستی با این مشخصات یافت نشد" }
            const findRequest = request.inviteRequest.find(item => item.id == id)
            if (findRequest.status !== 'pending') throw { status: 400, message: 'این درخواست قبلا پذیرفته شده است' }
            if (!["accepted", "rejected"].includes(status)) throw { status: 400, message: "اطلاعات ارسال شده صحیح نمی باشد" }
            const updateResult = await UserModel.updateOne({ "inviteRequest._id": id },
                {
                    $set: { "inviteRequest.$.status": status }
                })
            if (updateResult.modifiedCount == 0) throw { status: 400, message: "تغییر وضعیت درخواست انجام نشد، لطفا دوباره تلاش کنید" }
            return res.status(200).json({
                status: 200,
                success: true,
                message: "تغییر وضعیت درخواست با موفقیت انجام شد"
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    UserController: new UserController()
}