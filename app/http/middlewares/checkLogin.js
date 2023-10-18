const { tokenJwtVerify } = require("../../modules/functions")
const { UserModel } = require("../../models/user.model")
const checkLogin = async (req, res, next) => {
    try {
        let verifyError = { status: 401, message: 'لطفا وارد حساب کاربری خود شوید' }
        const authorization = req?.headers?.authorization
        if (!authorization) throw verifyError
        let token = authorization.split(" ")?.[1]
        if (!token) throw verifyError
        const result = tokenJwtVerify(token)
        const { userName } = result
        const user = await UserModel.findOne({ userName }, { password: 0 })
        if (!user) throw verifyError
        req.user = user
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = { checkLogin }