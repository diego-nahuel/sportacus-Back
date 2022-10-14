const Product = require('../models/Products')
const Joi = require('joi')

const validator = Joi.object({
    "name": Joi.string().min(4).message("El nombre ingresado es muy corto").max(30).message("El nombre ingresado es muy largo"),
    "sport": Joi.string().min(1).message("El nombre del deporte ingresado es muy corto").max(48).message("El nombre del deporte ingresado es muy largo"),
    "type": Joi.string().min(0).message("El precio debe ser mayor a 0"),
    "price": Joi.number().min(1).message("El precio debe ser mayor a 0"),
    "stock": Joi.number().min(0).message("El stock no puede ser menor a 0"),
    "image": Joi.string().uri().message("La imagen no corresponde a un Url valido"),
    "description": Joi.string().min(8).message("La descripcion ingresada es muy corta")
})

const productController = {
    create: async (req, res) => {
        const { name, image, price, description } = req.body
        try {
            await validator.validateAsync(req.body)
            let product = await new Product(req.body).save()

            if (product) {
                res.status(201).json({
                    message: "Producto creado con exito",
                    response: product,
                    success: true
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    },
    update: async (req, res) => {
        const { id } = req.params
        const modifyC = req.body

        try {
            await validator.validateAsync(req.body)
            let product = await Product.findOneAndUpdate({ _id: id }, modifyC, { new: true })
            if (product) {
                res.status(200).json({
                    message: "Producto editado con exito",
                    response: product,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Producto no encontrado",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    }, destroy: async (req, res) => {
        const { id } = req.params
        try {
            let product = await Product.findOneAndDelete({ _id: id })
            if (product) {
                res.status(200).json({
                    message: "Producto eliminado con exito",
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Producto no encontrado",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, profucto no eliminado",
                success: false
            })
        }
    },
    all: async (req, res) => {
        let products
        let query = {}

        if (req.query.sport) {
            query.sport = req.query.sport
        }
        // if (req.query.name) {
        //     let regExp = new RegExp(`^${req.query.name}`, "i")
        //     query.name = regExp
        // }
        if (req.query.name) {
            const input = req.query.name
            query.name = { $regex: '^' + input, $options: 'i' }
            console.log(query.name);
        }

        try {
            if(!query.sport && req.query.name === "all") {
                products = await Product.find()
                res.status(200).json({
                    success: true,
                    message: "Estos son todos los productos",
                    response: products,
            })} else if (query.sport && query.name === "all"){
                products = await Product.find({sport:query.sport})
                res.status(200).json({
                    success: true,
                    message: "Estos son todos los productos",
                    response: products,
                })
            } else if(query.name && !query.sport) {
                products = await Product.find({name:query.name})
                res.status(200).json({
                    success: true,
                    message: "Estos son todos los productos",
                    response: products,
                })
            } else{
                //products = await Product.find({name:{$regex:"^"+query.name},sport:query.sport})
                products = await Product.find({name:query.name,sport:query.sport})
                res.status(200).json({
                    success: true,
                    message: "Estos son todos los productos",
                    response: products,
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'Error, productos no encontrados',
                success: false
            })
        }
    },
    readOne: async (req, res) => {
        const { id } = req.params
        try {
            let product = await Product.findOne({ _id: id })
            if (product) {
                res.status(200).json({
                    message: "Este es el producto que buscabas",
                    response: product,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: 'No se encontro el producto',
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Error, producto no encontrado",
                success: false
            })
        }
    }
}

module.exports = productController