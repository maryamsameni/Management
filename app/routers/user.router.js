const { checkLogin } = require("../http/middlewares/checkLogin")
const { expressValidatorMapper } = require("../http/middlewares/checkError")
const { UserController } = require("../http/controllers/user.controller")
const { imageValidator } = require("../http/validations/userValidation")
const { uploadMulter } = require("../modules/multer")
const router = require('express').Router()

router.get('/get/profile', checkLogin, UserController.getProfile)
router.put('/edit/profile', checkLogin, UserController.editProfile)
router.post('/uploadimage/profile', uploadMulter.single('image'), imageValidator(), expressValidatorMapper, checkLogin, UserController.uploadProfileImage)

module.exports = { userRoutes: router }