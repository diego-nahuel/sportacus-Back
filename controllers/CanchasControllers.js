const CanchaModel = require('../models/Canchas')

const canchaController = {
    crearCancha: async(req, res) => {
        let {name, user, city, price, image, likes, description} = req.body
        try{
                let cancha = await new CanchaModel(req.body).save()
                res.status(201).json({
                    message: "Cancha creada con exito",
                    response: cancha._id,
                    success: true
                })
        } catch (error){
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no credada",
                success: false
            })
        }
    },

    editarCancha: async (req, res) => {
        const {id} = req.params
        const {role} = req.user
        const {name, user, city, price, image, likes, description } = req.body
        let cancha = {}
        try {
            if (cancha) {
                cancha = await CanchaModel.findOne({_id:id})
                if(role === "admin") {
                    cancha = await CanchaModel.findOneAndUpdate({_id:id}, req.body, {new: true})
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
        } catch(error) {
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no editada",
                success: false
            })
        }
    },

    EliminarCancha: async(req, res) => {
        const {id} = req.params

        try{
            let cancha = await CanchaModel.findOneAndDelete({_id:id})
            if(cancha){
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
        }catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no eliminada",
                success: false
            })
        }
    },

    TodasCanchas: async (req, res) => {
        const query = {}
        let canchas
        if(req.query.name){
            let regExp = new RegExp(`^${req.query.name}`,"i")
            query.name = regExp
        }
        try{
            canchas = await CanchaModel.find(query)
            if(canchas.length > 0){
                res.status(200).json({
                    message: "Estas son todas las canchas",
                    response: canchas,
                    success: true
                })
            } else {
                res.status(200).json({
                    message: "No se encontraron canchas",
                    success: true,
                })
            }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, canchas no encontradas",
                success: false
            })
        }
    },
    
    UnaCancha: async (req, res) => {
        const {id} = req.params

        try{
            let cancha = await CanchaModel.findOne({_id:id})
            if(cancha){
                res.status(200).json({
                    message: "Esta es la ciudad que buscabas",
                    response: cancha,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "No se encontro la cancha",
                    success: false
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no encontrada",
                success: false
            })
        }
    },

    likeDislike: async (req, res) => {
        let {canchaId} = req.body
        let {id} = req.usuario
        console.log(req.body)
        console.log(req.usuario)
        try{
            let likedCancha = await CanchaModel.findOne({_id:canchaId})
            if(likedCancha && likedCancha.likes.includes(id)){
                likedCancha.likes.pull(id)
                await likedCancha.save()
                res.status(200).json({
                    message: "dislike",
                    response: likedCancha.likes,
                    success: true
                })
            } else if(likedCancha && !likedCancha.likes.includes(id)){
                likedCancha.likes.push(id)
                await likedCancha.save()
                res.status(200).json({
                    message: "like",
                    response: likedCancha.likes,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Cancha no encontrada",
                    success: false
                })
            }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    },

    porUsuario: async (req, res) => {
        try{
            let canchas = await CanchaModel.find({usuario: req.user.userId.toString()})
            .populate("usuario", {name:1, photo:1})
            if(canchas){
                res.status(200).json({
                    message: "Canchas encontradas",
                    response: canchas,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Canchas no encontradas",
                    success: false
                })
            }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    }
}

module.exports = canchaController