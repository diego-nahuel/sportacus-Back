const Product = require('../models/Products')

const productController ={
    create: async(req, res)=>{
        const{name, image, price,description}=req.body
        try{
         let product = await new Product(req.body).save()
         
         if(product){res.status(201).json({
            messege:"Producto creado con exito",
            response:product,
            success:true
         })}
        }catch(error){
            console.log(error)
            res.status(400).json({
                messege:"Error, producto no creado",
                success:false
            })
        }
    },
    update: async (req, res)=>{
        const {id} = req.params
        const {name, image, price, description} = req.body
        try{
           let product = await Product.findOneAndUpdate({_id:id}, modifyC,{new: true})
           if (product) {
            res.status(200).json({
                message:"Producto editado con exito",
                response: product,
                success:true
            })
           } else {
            res.status(404).json({
                message:"Producto no encontrado",
                success:false
            })
           }
        }catch (error){
            console.log(error)
            res.status(400).json({
                message: "Error, producto no editado",
                success: false
            })
        }
    },destroy: async(req, res)=>{
        const {id} = req.params
        try{
            let product = await Product.findOneAndDelete({_id:id})
            if (product) {
                res.status(200).json({
                    message:"Producto eliminado con exito",
                    success:true
                })
               } else {
                res.status(404).json({
                    message:"Producto no encontrado",
                    success:false
                })
               }
        }catch (error){
             console.log(error)
             res.status(400).json({
                message:"Error, profucto no eliminado",
                success:false
             })
        }
    },
    all: async(req,res)=>{
        let products
        let query={}
        if (req.query.name) {
            let regExp = new RegExp(`^${req.query.name}`,"i")
            query.name = regExp
        }
        try{
            products = await Product.find(query)
           if(products){ res.status(200).json({
                message:"Estos son todos los productos",
                response:products,
                success:true
            })
        }else{
            res.status(404).json({
                message:'No se encontraron productos',
                success:false
            })
        }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message:'Error, productos no encontrados',
                success:false
            })
        }
    },
    readOne: async(req, res)=>{
        const {id}=req.params
        try{
            let product = await Product.findOne({_id:id})
            if(product){
                res.status(200).json({
                    message:"Este es el producto que buscabas",
                    response:product,
                    success:true
                })
            }else{
                res.status(404).json({
                    message:'No se encontro el producto',
                    success:false
                })
            }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message:"Error, producto no encontrado",
                success:false
            })
        }
    }
}

module.exports = productController