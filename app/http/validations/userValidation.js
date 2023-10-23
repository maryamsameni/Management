const { body } = require("express-validator")
const path = require("path")

function imageValidator() {
    return [
        body("image").custom((value, { req }) => {
            if (Object.keys(req.file).length == 0) throw new Error("لطفا یک تصویر را انتخاب کنید")
            const ext = path.extname(req.file.originalname)
            const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
            const whiteListFormat = ['.png', '.jpg', '.jpeg', '.webp']
            if (!whiteListFormat.includes(req.file.mimetype)) {
                throw new Error("فرمت ارسال شده صحیح نمیباشد")
            }
            const maxSize = 2 * 1024 * 1024;
            if (req.file.size > maxSize) throw new Error("حجم فایل نمیتواند بیبشتر از 2 مگابایت باشد")
            return true
        })
    ]
}
module.exports = {
    imageValidator
}