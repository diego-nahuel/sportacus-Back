const { resolveInclude } = require('ejs')
const CanchaModel = require('../models/Canchas')

const canchaController = {
    crearCancha: async(req, res) => {
        try{
            if(req.user.role === "admin"){
                cancha = await new CanchaModel(req.body).save()
                res.status(201).json({
                    message: "Cancha creada con exito",
                    response: cancha._id,
                    success: true
                })
            } else {
                res.status(401).json({
                    message: "No autorizado",
                    success: true,
                })
            }
        } catch (error){
            console.log(error)
            res.status(400).json({
                message: "Error, cancha no credada",
                success: false
            })
        }
    },

    modificarCancha: async (req, res) => {
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
        if(req.query.city){
            let regExp = new RegExp(`^${req.query.city}`,"i")
            query.city = regExp
        }
        try{
            canchas = await CanchaModel.find(query)
            if(canchas){
                res.status(200).json({
                    message: "Estan son todas las canchas",
                    response: canchas,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "No se encontraron canchas",
                    success: false,
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
    }
}

module.exports = canchaController