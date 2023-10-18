const { authRoutes } = require('./auth.router')
const { projectRoutes } = require('./project.router')
const { teamRoutes } = require('./team.router')
const { userRoutes } = require('./user.router')

const router = require('express').Router()
router.use('/project', projectRoutes)
router.use('/team', teamRoutes)
router.use('/user', userRoutes)
router.use('/auth', authRoutes)

module.exports = { AllRoutes: router }