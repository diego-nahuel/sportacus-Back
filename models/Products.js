const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: String, required: true },
    sport: { type: String, required: true },
    type: [{ type: String, required: true }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }]
})

const Product = mongoose.model(
    'products',
    schema
)

module.exports = Product