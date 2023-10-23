const { createUploadPath } = require("./functions")
const path = require('path')

const uploadFile = async (req, res, next) => {
    try {
        if (req.file || Object.keys(req.files).length == 0) throw { status: 400, message: "تصویر شاخص پروژه را ارسال کنید" }
        let image = req.files.image
        let type = path.extname(image.name)
        if (![".PNG", ".JPG", ".JPEG", ".WEBPE", ".GIF"].includes(type)) throw { status: 400, message: 'فرمت ارسال شده تصویر صحیح نمی باشد ' }
        const imagePath = path.join(createUploadPath(), (Date.now() + type))
        req.body.image = imagePath.substring(7)
        let uploadPath = path.join(__dirname, "..", "..", imagePath)
        image.mv(uploadPath, (err) => {
            if (err) throw { status: 500, message: "بارگذاری تصویر انجام نشد" }
            next()
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { uploadFile }

