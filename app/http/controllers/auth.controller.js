const { UserModel } = require("../../models/user.model")
const { hashString } = require("../../modules/functions")
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

    login() { }
    resetPassword() { }
}
module.exports = { AuthController: new AuthController }