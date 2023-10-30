const { body, param } = require("express-validator")
const { TeamModel } = require("../../models/team.model")

function createTeamValidator() {
    return [
        body('name').isLength({ min: 5, max: 30 }).withMessage("نام تیم نمیتواند کمتر از 5 کاراکتر یا بیشتر از 30 کاراکتر باشد"),
        body("description").notEmpty().withMessage("توضیحات نمیتواند خالی باشد"),
        body("userName").custom(async (userName) => {
            const userNameRegex = /^[a-z]+[A-z0-9\_\.]{4,}$/gim
            if (userName.match(userNameRegex)) {
                const team = await TeamModel.findOne({ userName })
                if (team) throw "نام کاربری قبلا توسط تیم دیگری استفاده شده است"
                return true
            }
            throw "نام کاربری را به طور صحیح وارد کنید"
        })
    ]
}

module.exports = {
    createTeamValidator
}