const Comment = require('../models/Comment')

const commentController = {
    CreateComment: async (req, res) => {
        const {comment, field, product} = req.body
        const user = req.user.id

        try{
            let comment = await new Comment({comment, field, product}, user).save()
            res.status(201).json({
                message: "Comentario creado con exito",
                response: comment._id,
                success: true
            })
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, comentario no creado",
                success: false
            })
        }
    },
    
    AllComments: async (req, res) => {
        let query = {}
        if(req.query.field){
            query.field = req.query.field
        }
        if(req.query.user){
            query.user = req.query.user
        }

        try{
            let comment = await Comment.find(query)
            .populate("field", {name:1, city:1})
            .populate("user", {name:1, photo:1})
            if(comment){
                res.status(200).json({
                    message: "Aqui estan los comentarios",
                    response: comment,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "No existen comentarios",
                    success: true
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, comentarios no encontrados",
                success: false
            })
        }
    },

    OneComment: async (req, res) => {
        const {id} = req.params

        try{
            let comment = await Comment.findOne({_id:id})
            if(comment){
                res.status(200).json({
                    message: "Aqui esta el comentario",
                    response: comment,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "El comentario no existe",
                    success: true
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, mensaje no encontrado",
                success: false
            })
        }
    },

    UpdateComment: async (req, res) => {
        const {comment, cancha} = req.body
        const {id, role} = req.user

        try{
            let comment = await Comment.findOneAndUpdate({_id:id}, {comment: req.body.data}, {new: true})
            if(comment){
                if(comment.user.toString() === userId.toString() || role === 'admin'){
                    res.status(200).json({
                        message: "Comentario editado con exito",
                        response: comment,
                        success: true
                    })
                } else {
                    res.status(401).json({
                        message: "No autorizado",
                        success: false
                    })
                }
            } else {
                res.status(404).json({
                    message: "Comentario no encontrado",
                    success: true
                })
            }
        } catch(error) {
            console.log(error)
            res.status(400).json({
                message: "Error, comentario no editado",
                success: false
            })
        }
    },

    DeleteComment: async (req, res) => {
        const {id, role} = req.user

        try{
            let comment = await Comment.findOne({_id:id})
            if(comment.user.toString() === userId.toString() || role === 'admin'){
                await Comment.findOneAndDelete({_id:id})
                res.status(200).json({
                    message: "Comentario eliminado con exito",
                    response: comment._id,
                    success: true
                })
            } else {
                res.status(401).json({
                    message: "No autorizado",
                    success: true
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, comentario no eliminado",
                success: false
            })
        }
    }
}

module.exports = commentController