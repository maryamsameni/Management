const { UserModel } = require("../../models/user.model")
const { hashString, tokenGenerator } = require("../../modules/functions")
const bcrypt = require('bcrypt')

class AuthController {
    async register(req, res, next) {
        try {
            const { userName, password, email, mobile } = req.body
            const hashPassword = hashString(password)
            const user = await UserModel.create({ userName, password: hashPassword, email, mobile })
                .catch(err => {
                    if (err?.code == 11000) {
                        throw { status: 400, message: 'نام کاربری قبلا استفاده شده است' }
                    }
                })
            return res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { userName, password } = req.body
            const user = await UserModel.findOne({ userName })
            if (!user) throw { status: 401, message: "نام کاربری یا رمز عبور اشتباه است " }
            const compareResult = bcrypt.compareSync(password, user.password)
            if (!compareResult) throw { status: 401, message: 'نام کاربری یا رمز عبور اشتباه است' }
            const token = tokenGenerator({ userName })
            user.token = token
            await user.save()
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'شما با موفقیت وارد حساب کاربری خود شدید',
                token
            })
        } catch (error) {
            next(error.message)
        }
    }
}

module.exports = { AuthController: new AuthController }