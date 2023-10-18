const { body } = require('express-validator')
const { UserModel } = require("../../models/user.model")
function registerValidator() {
    return [
        body("userName").notEmpty().custom(async (value, cxt) => {
            if (value) {
                const userNameRegex = /^[a-z]+[A-Z0-9\_\.]{2,30}/gi
                if (userNameRegex.test(value)) {
                    const user = await UserModel.findOne({ userName: value })
                    if (user) throw ('نام کاربری تکراری می باشد')
                    return true
                }
                throw ('userName is Not True, please Try Again ..')
            }
            throw ('userName can\'t be empty')
        }),
        body('email').isEmail().withMessage('The Email Entered is not correct ..')
            .custom(async (email) => {
                const Email = await UserModel.findOne({ email })
                if (Email) throw ('ایمیل وارد شده قبلا استفاده شده است')
                return true
            }),
        body('mobile').isMobilePhone('fa-IR').withMessage('The mobile Entered is not correct')
            .custom(async (mobile) => {
                const Mobile = await UserModel.findOne({ mobile })
                if (Mobile) throw ('شماره موبایل وارد شده قبلا استفاده شده است ')
                return true
            }),
        body('password').isLength({ min: 6, max: 15 }).withMessage('The password must be at least 6 and at most 15 characters').custom((value, cxt) => {
            if (!value) throw ('password can\'t be Empty .. ')
            if (value !== cxt?.req?.body?.confirmPassword) throw ('The password is not equal with password')
            return true
        })
    ]
}

function loginValidator() {
    return [
        body('userName').notEmpty().withMessage('نام کاربری نمی تواند خالی باشد'),
       
        body('password').isLength({ min: 6, max: 16 }).withMessage('رمز عبور حداقل باید 6 و حداکثر 16 باشد')
    ]
}
module.exports = { registerValidator, loginValidator }