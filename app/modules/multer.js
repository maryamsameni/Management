const multer = require('multer')
const path = require('path')
const { createUploadPath } = require('./functions')

const storageMulter = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, createUploadPath())
    },
    filename: (req, file, cb) => {
        const type = path.extname(file?.originalname || "")
        cb(null, Date.now() + type)
    }
})

const uploadMulter = multer({ storage: storageMulter })

module.exports = {
    uploadMulter
}