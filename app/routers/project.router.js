const router = require('express').Router()
const { ProjectController } = require("../http/controllers/project.controller")
const { checkLogin } = require("../http/middlewares/checkLogin")
const { createProjectValidator } = require("../http/validations/projectValidation")
const { expressValidatorMapper } = require("../http/middlewares/checkError")
const { uploadFile } = require("../modules/expressFileUpload")
const fileUpload = require("express-fileupload")
const { mongoIdValidator } = require("../http/validations/public")

router.post("/create", fileUpload(), checkLogin, uploadFile, createProjectValidator(), expressValidatorMapper, ProjectController.createProject)
router.get("/list", checkLogin, ProjectController.getAllProject)
router.get("/list/:id", checkLogin, mongoIdValidator(), expressValidatorMapper, ProjectController.getProjectById)
router.delete("/delete/:id", checkLogin, mongoIdValidator(), expressValidatorMapper, ProjectController.removeProject)
router.put("/update/:id", checkLogin, mongoIdValidator(), expressValidatorMapper, ProjectController.updateProject)
router.patch("/updateProjectImage/:id", fileUpload(), checkLogin, uploadFile, mongoIdValidator(), expressValidatorMapper, ProjectController.updateProjectImage)

module.exports = { projectRoutes: router }  