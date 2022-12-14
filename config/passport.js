const passport = require('passport')
const passportJwt = require('passport-jwt')
const {JWT_TOKEN} = process.env
const User = require('../models/User')

passport.use(
    new passportJwt.Strategy(
        {
            jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_TOKEN
        },
        async (jwt_payload, done) => {
            console.log(jwt_payload)
            try{
                let user = await User.findOne({_id:jwt_payload.id})
                if(user){
                    user = {
                        id: user._id,
                        name: user.name,
                        photo: user.photo,
                        mail: user.mail,
                        role: user.role
                    }
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } catch(error){
                console.log(error)
                return done(error, false)
            }
        }
    )
)

module.exports = passport