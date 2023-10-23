const { ProjectModel } = require("../../models/project.model")
const { createLinkForFiles } = require("../../modules/functions")
const autoBind = require("auto-bind")

class ProjectController {
    constructor() {
        autoBind(this)
    }

    async createProject(req, res, next) {
        try {
            const owner = req.user._id
            const { text, title, image, tags } = req.body
            const result = await ProjectModel.create({
                text, title, owner, image, tags
            })
            if (!result) throw { statys: 400, message: "افزودن پروژه با مشکل مواجه شد" }
            return res.status(201).json({
                status: 201,
                success: true,
                message: "پروژه با موفقیت ایجاد شد"
            })

        } catch (error) {
            next(error)
        }
    }

    async getAllProject(req, res, next) {
        try {
            const owner = req.user._id
            const projects = await ProjectModel.find({ owner })
            for (const item of projects) {
                item.image = createLinkForFiles(item.image, req)
            }
            return res.status(200).json({
                status: 200,
                success: true,
                projects
            })
        } catch (error) {
            next(error)
        }
    }

    //Function
    async findProject(projectId, owner) {
        const project = await ProjectModel.findOne({ owner, _id: projectId })
        if (!project) throw { status: 404, message: 'پروژه یافت نشد !!' }
        return project
    }

    async getProjectById(req, res, next) {
        try {
            const owner = req.user._id
            const projectId = req.params.id
            const projectById = await this.findProject(projectId, owner)
            projectById.image = createLinkForFiles(projectById.image, req)
            return res.status(200).json({
                status: 200,
                success: true,
                projectById
            })
        } catch (error) {
            next(error)
        }
    }

    async removeProject(req, res, next) {
        try {
            const owner = req.user._id
            const projectId = req.params.id
            await this.findProject(projectId, owner)
            const removeProjectResult = await ProjectModel.deleteOne({ _id: projectId })
            if (removeProjectResult.deletedCount == 0) throw { status: 400, message: 'پروژه حذف نشد !!!' }
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'پروژه با موفقیت حذف شد '
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProject(req, res, next) {
        try {
            const owner = req.user._id
            const projectId = req.params.id
            await this.findProject(projectId, owner)
            const data = { ...req.body }
            Object.entries(data).forEach(([key, value]) => {
                if (!("title", "text", "tags").includes(key)) delete data[key]
                if (["", " ", 0, null, undefined, NaN].includes(value)) delete data[key]
                if (key == "tags" && (data['tags'].constructor === Array)) {
                    data['tags'] = data['tags'].filter(val => {
                        if (!["", " ", 0, null, undefined, NaN].includes(val)) return val
                    })
                    if (data['tags'].lenght == 0) delete data['tags']
                }
            })
            const updateResult = await ProjectModel.updateOne({ _id: projectId }, { $set: data })
            if (updateResult.modifiedCount == 0) throw { status: 400, message: 'به روز رسانی انجام نشد' }
            res.status(200).json({
                status: 200,
                success: true,
                message: "به روزرسانی با موفقیت انجام شد"
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProjectImage(req, res, next) {
        try {
            const { image } = req.body
            const owner = req.user._id
            const projectId = req.params.id
            await this.findProject(projectId, owner)
            const updateImageProject = await ProjectModel.updateOne({ _id: projectId }, { $set: { image } })
            if (updateImageProject.modifiedCount == 0) throw { status: 400, message: 'به روز رسانی انجام نشد' }
            return res.status(400).json({
                status: 200,
                success: true,
                message: 'به روز رسانی با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { ProjectController: new ProjectController() }