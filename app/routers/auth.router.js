const router = require('express').Router()
const { registerValidator } = require('../http/validations/authValidation')
const { AuthController } = require('../http/controllers/auth.controller')
const { expressValidatorMapper } = require("../http/middlewares/checkError")

router.post('/register', registerValidator(), expressValidatorMapper, AuthController.register)
module.exports = { authRoutes: router }