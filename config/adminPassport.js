const adminPassport = require('passport')
const passportJwt = require('passport-jwt')
const {JWT_TOKEN} = process.env
const User = require('../models/User')

adminPassport.use(
    new passportJwt.Strategy(
        {
            jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_TOKEN
        },
        async(jwt_payload, done) => {
            try{
                let usuario = await User.findOne({_id:jwt_payload.id})
                if(usuario){
                    if(usuario.role === 'admin'){
                        usuario = {
                            id: usuario._id,
                            nombre: usuario.name,
                            foto: usuario.photo,
                            mail: usuario.mail,
                            role: usuario.role
                        }
                        return done(null, usuario)
                    } else {
                        return done(null, false)
                    }
                } else {
                    return done(null, false)
                }
            } catch (error){
                console.log(error)
                return done(error, false)
            }
        }
    )
)

module.exports = adminPassport