const router = require('express').Router()
const { UserController } = require("../http/controllers/user.controller")
const { checkLogin } = require("../http/middlewares/checkLogin")

router.get('/get/profile', checkLogin, UserController.getProfile)
router.put('/edit/profile', checkLogin, UserController.editProfile)

module.exports = { userRoutes: router }