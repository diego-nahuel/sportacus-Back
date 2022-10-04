const Comment = require('../models/Comment')

const comentarioController = {
    crearComentario: async (req, res) => {
        const {comment, cancha, product} = req.body
        const user = req.user.id

        try{
            let comentario = await new Comment({comment, cancha, product}, user).save()
            res.status(201).json({
                message: "Comentario creado con exito",
                response: comentario._id,
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
    
    todosComentarios: async (req, res) => {
        let query = {}
        if(req.query.cancha){
            query.cancha = req.query.cancha
        }
        if(req.query.user){
            query.user = req.query.user
        }

        try{
            let comentario = await Comment.find(query)
            .populate("cancha", {name:1, city:1})
            .populate("user", {name:1, photo:1})
            if(comentario){
                res.status(200).json({
                    message: "Aqui estan los comentarios",
                    response: comentario,
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

    unComentario: async (req, res) => {
        const {id} = req.params

        try{
            let comentario = await Comment.findOne({_id:id})
            if(comentario){
                res.status(200).json({
                    message: "Aqui esta el comentario",
                    response: comentario,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Mensaje no existente",
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

    editarComentario: async (req, res) => {
        const {comment, cancha} = req.body
        const {id, role} = req.user

        try{
            let comentario = await Comment.findOneAndUpdate({_id:id}, {commentario: req.body.data}, {new: true})
            if(comentario){
                if(comment.user.toString() === userId.toString() || role === 'admin'){
                    res.status(200).json({
                        message: "Comentario editado con exito",
                        response: comentario,
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

    eliminarComentario: async (req, res) => {
        const {id, role} = req.user

        try{
            let comentario = await Comment.findOne({_id:id})
            if(comentario.user.toString() === userId.toString() || role === 'admin'){
                await Comment.findOneAndDelete({_id:id})
                res.status(200).json({
                    message: "Comentario eliminado con exito",
                    response: comentario._id,
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

module.exports = comentarioController