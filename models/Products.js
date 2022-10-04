const mongoose=require('mongoose')

const schema = new mongoose.Schema({
    name:{type: String, required:true},
    image:{type: String, required:true},
    price:{type:Number, required:true},
    descriprion:{type: String, required:true}
})

const Product = mongoose.model(
    'products',
    schema
)

module.exports = Product