const router = require('express').Router()
const { registerValidator, loginValidator } = require('../http/validations/authValidation')
const { AuthController } = require('../http/controllers/auth.controller')
const { expressValidatorMapper } = require("../http/middlewares/checkError")

router.post('/register', registerValidator(), expressValidatorMapper, AuthController.register)
router.post('/login', loginValidator(), AuthController.login)
module.exports = { authRoutes: router }