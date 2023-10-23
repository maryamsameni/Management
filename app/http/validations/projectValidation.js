const { body } = require("express-validator")
function createProjectValidator() {
    return [
        body('title').notEmpty().withMessage("عنوان پروژه نمیتواند خالی باشد"),
        body('tags').isArray({ min: 0, max: 15 }).withMessage("حداکثر استفاده از هشتگ ها 10 عدد می باشد"),
        body('text').notEmpty().isLength({ min: 20 }).withMessage(" توضیحات پروژه نمیتواند خالی باشد و حداقل متن باید 20 کاراکتر باشد")
    ]
}
module.exports = {
    createProjectValidator
}