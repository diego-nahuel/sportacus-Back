const FieldModel = require('../models/Fields')

const FieldsController = {
    CreateField: async (req, res) => {
        let { name, user, city, price, image, likes, description } = req.body
        try {
            let field = await new FieldModel(req.body).save()
            res.status(201).json({
                message: "Cancha creada con exito",
                response: field._id,
                success: true
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no credada",
                success: false
            })
        }
    },

    UpdateField: async (req, res) => {
        const { id } = req.params
        const { role } = req.user
        const { name, user, city, price, image, likes, description } = req.body
        let field = {}
        try {
            if (field) {
                field = await FieldModel.findOne({ _id: id })
                if (role === "admin") {
                    cancha = await FieldModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
                    res.status(200).json({
                        message: "Cancha editada con exito",
                        response: cancha,
                        success: true
                    })
                } else {
                    res.status(401).json({
                        message: "No autorizado",
                        success: true
                    })
                }
            } else {
                res.status(404).json({
                    message: "Cancha no encontrada",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no editada",
                success: false
            })
        }
    },

    DeleteField: async (req, res) => {
        const { id } = req.params

        try {
            let field = await FieldModel.findOneAndDelete({ _id: id })
            if (field) {
                res.status(200).json({
                    message: "Cancha eliminada con exito",
                    response: id,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Cancha no encontrada",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no eliminada",
                success: false
            })
        }
    },

    AllFields: async (req, res) => {
        const query = {}
        let fields
        if (req.query.name) {
            let regExp = new RegExp(`^${req.query.name}`, "i")
            query.name = regExp
        }
        if (req.query.sport) {
            let regExp = new RegExp(`^${req.query.sport}`, "i")
            query.sport = regExp
        }
        if (req.query.city) {
            let regExp = new RegExp(`^${req.query.city}`, "i")
            query.city = regExp
        }
        
        try {
            fields = await FieldModel.find(query)
            if (fields.length > 0) {
                res.status(200).json({
                    message: "Estas son todas las canchas",
                    response: fields,
                    success: true
                })
            } else {
                res.status(200).json({
                    message: "No se encontraron canchas",
                    success: true,
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, canchas no encontradas",
                success: false
            })
        }
    },

    OneField: async (req, res) => {
        const { id } = req.params

        try {
            let field = await FieldModel.findOne({ _id: id })
            if (field) {
                res.status(200).json({
                    message: "Esta es la ciudad que buscabas",
                    response: field,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "No se encontro la cancha",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no encontrada",
                success: false
            })
        }
    },

    likeDislike: async (req, res) => {
        let { fieldId } = req.params
        let { id } = req.user

        try {
            let field = await FieldModel.findOne({ _id: fieldId })
            if (field && field.likes.includes(id)) {
                let likedField = await FieldModel.findOneAndUpdate({ _id: fieldId }, { $pull: { likes: id } }, { new: true })
                // likedField.likes.pull(id)
                // await likedField.save()
                res.status(200).json({
                    message: "dislike",
                    response: likedField.likes,
                    success: true
                })
            } else if (field && !field.likes.includes(id)) {
                let likedField = await FieldModel.findOneAndUpdate({ _id: fieldId }, { $push: { likes: id } }, { new: true })
                // likedField.likes.push(id)
                // await likedField.save()
                res.status(200).json({
                    message: "like",
                    response: likedField.likes,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Cancha no encontrada",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    },

    ByUser: async (req, res) => {
        try {
            let fields = await FieldModel.find({ user: req.user.userId.toString() })
                .populate("user", { name: 1, photo: 1 })
            if (fields) {
                res.status(200).json({
                    message: "Canchas encontradas",
                    response: fields,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Canchas no encontradas",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    }
}

module.exports = FieldsController