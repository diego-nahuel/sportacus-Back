const mongoose=require('mongoose')

const schema= new mongoose.Schema({
    name:{type: String, required:true},
    user:{type: mongoose.Types.ObjectId, ref: 'users', required: true},
    city:{type: String, required:true},
    price:{type: Number, required:true},
    image:{type:String, required:true},
    likes:{type: Array, required:true},
    description:{type: String, required:true}
})

const Cancha = mongoose.model(
    'canchas',
    schema
)

module.exports = Cancha