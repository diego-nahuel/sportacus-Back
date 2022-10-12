const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    comment:{type: String, required: true},
    user:{type: mongoose.Types.ObjectId, ref: 'users', required: true},
    field:{type: mongoose.Types.ObjectId, ref: 'fields'},
    // product:{type: mongoose.Types.ObjectId, ref: 'products'},
})
const Comment = mongoose.model(
    'comments', 
    schema
    //nombre de la coleccion
    //esquema de datos (tabla)

)

module.exports = Comment