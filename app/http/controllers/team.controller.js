const { TeamModel } = require("../../models/team.model")
const { UserModel } = require("../../models/user.model")
const autoBind = require("auto-bind")
class TeamController {
    constructor() {
        autoBind(this)
    }
    async createTeam(req, res, next) {
        try {
            const { name, description, userName } = req.body
            const owner = req.user._id
            const team = await TeamModel.create({
                name,
                userName,
                description,
                owner
            })
            if (!team) throw { status: 400, message: "ایجاد تیم با مشکل مواجه شد" }
            return res.status(200).json({
                status: 201,
                success: true,
                message: 'ایجاد تیم با موفقیت انجام شد',
                team
            })
        } catch (error) {
            next(error)
        }
    }

    async getListOfTeam(req, res, next) {
        try {
            const teams = await TeamModel.find({})
            res.status(200).json({
                status: 200,
                success: true,
                teams
            })
        } catch (error) {
            next(error)
        }
    }

    async getTeamById(req, res, next) {
        try {
            const teamId = req.params.id
            const teamById = await TeamModel.findById({ _id: teamId })
            if (!teamById) throw "تیمی یافت نشد"
            res.status(200).json({
                status: 200,
                success: true,
                teamById
            })
        } catch (error) {
            next(error)
        }
    }

    async getMyteams(req, res, next) {
        try {
            const userId = req.user._id
            // const teams = await TeamModel.find({
            //     $or: [
            //         { owner: userId },
            //         { users: userId }
            //     ]
            // })
            const teams = await TeamModel.aggregate([
                {
                    $match: {
                        $or: [{ owner: userId }, { users: userId }]
                    }
                }, {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "users"
                    }
                }, {
                    $project: {
                        "users.userName": 1,
                        "users.mobile": 1,
                        "users.email": 1
                    }
                }, { $unwind: "$users" }
            ])
            return res.status(200).json({
                status: 200,
                success: true,
                teams
            })
        } catch (error) {
            next(error)
        }
    }

    async removeTeamById(req, res, next) {
        try {
            const teamId = req.params.id
            const findTeam = await TeamModel.findById({ _id: teamId })
            if (!findTeam) throw "تیم وجود ندارد !!!"
            const team = await TeamModel.deleteOne({ _id: findTeam })
            if (team.deletedCount == 0) throw { status: 400, message: 'حذف تیم انجام نشد' }
            res.status(200).json({
                status: 200,
                success: true,
                message: 'تیم موردنظر پاک شد'
            })
        } catch (error) {
            next(error)
        }
    }

    // function
    async findUserInTeam(teamId, userId) {
        const result = await TeamModel.findOne({
            $or: [
                { owner: userId },
                { users: userId }
            ],
            _id: teamId
        })
        return !!result
    }

    async inviteUserToTeam(req, res, next) {
        try {
            const userId = req.user._id
            const { teamId, userName } = req.params
            const team = await this.findUserInTeam(teamId, userId)
            if (!team) throw { status: 400, message: 'تیمی جهت دعوت کردن افراد یافت نشد' }
            const user = await UserModel.findOne({ userName })
            if (!user) throw { status: 400, message: 'کاربر موردنظر جهت دعوت به تیم یافت نشد' }

            const userInvited = await this.findUserInTeam(teamId, user._id)
            if (userInvited) throw { status: 400, message: 'کاربر موردنظر قبلا به تیم دعوت شده است' }
            const request = {
                caller: req.user.userName,
                requestDate: new Date(),
                teamId,
                status: 'pending'
            }
            const updateUserResult = await UserModel.updateOne({ userName }, { $push: { inviteRequest: request } })
            if (updateUserResult.modifiedCount == 0) throw { status: 500, message: 'ثبت درخواست دعوت ثبت نشد' }

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'ثبت درخواست با موفقیت ایجاد شد'
            })
        } catch (error) {
            next(error)
        }
    }

    async updateTeam(req, res, next) {
        try {
            // const { name, description } = req.body
            const data = { ...req.body }
            Object.keys(data).forEach(key => {
                if (!data[key]) delete data[key]
                if (["", " ", null, undefined, NaN].includes(data[key])) delete data[key]
            })
            const userId = req.user._id
            const { teamId } = req.params
            const team = await TeamModel.findOne({ owner: userId, _id: teamId })
            if (!team) throw { status: 404, message: "تیمی با این مشحصات یافت نشد" }
            const teamEditResult = await TeamModel.updateOne({ _id: teamId }, {
                $set: data
            })
            if (teamEditResult.modifiedCount == 0) throw { status: 400, message: "به روز رسانی مشخصات تیم انجام نشد" }
            return res.status(200).json({
                status: 200,
                success: true,
                message: "به روز رسانی با موفقیت انجام شد"
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    TeamController: new TeamController()
}