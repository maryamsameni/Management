const router = require('express').Router()
const { UserController } = require("../http/controllers/user.controller")
const { checkLogin } = require("../http/middlewares/checkLogin")

router.get('/profile', checkLogin, UserController.getProfile)
module.exports = { userRoutes: router }