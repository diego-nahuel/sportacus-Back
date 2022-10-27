const User = require('../models/User')
const crypto = require('crypto')
const bcryptjs = require('bcryptjs')
const sendMail = require('./sendMail')
const jwt = require('jsonwebtoken')

const UserController = {

    AllUsers: async (req, res) => {
        let query = {}
        let users
        if(req.query.users){
            query.users = req.query.users
        }

        try{
            users = await User.find()
            if(users){
                res.status(200).json({
                    message: "Estos son todos los usuarios",
                    response: users,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Usuarios no encontrados",
                    success: true
                })
            }
        } catch (error){
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    },

    OneUser: async (req, res) => {
        const {id} = req.params

        try{
            let user = await User.findOne({_id:id})
            if(user){
                res.status(200).json({
                    message: "Usuario encontrado",
                    response: user,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Usuario no encontrado",
                    success: true
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, algo salio mal",
                success: false
            })
        }
    },

    DeleteUser: async (req, res) => {
        const {id} = req.params

        if(req.user !== null){
            try{
                await User.findOneAndDelete({_id:id})
                res.status(200).json({
                    message: "Usuario eliminado con exito",
                    success: true
                })
            } catch(error){
                console.log(error)
                res.status(400).json({
                    message: "Error, no se pudo eliminar el usuario",
                    success: false
                })
            }
        } else {
            res.status(401).json({
                message: "No autorizado",
                success: false
            })
        }
    },

    UpdateUser: async (req, res) => {
        const {mail} = req.body
        const {role} = req.user

        try{
            if(mail.toString() === mail || role === 'admin'){
                let user = await User.findOne({mail:mail})
                if(user){
                    let {name, photo, role} = req.body
                    if(role !== 'admin'){
                        user = await User.findOneAndUpdate({mail:mail}, {name, photo}, {new:true})
                        res.status(200).json({
                            message: "Usuario editado con exito",
                            response: user,
                            success: true
                        })
                    } else if( role == 'admin'){
                        user = await User.findOneAndUpdate({mail:mail}, {name, photo}, {new:true})
                        res.status(200).json({
                            message: "Usuario editado con exito",
                            response: user,
                            success: true
                        })
                    } else {
                        res.status(404).json({
                            message: "El usuario no existe",
                            success: true
                        })
                    }
                }
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, no se pudo editar el usuario",
                success: false
            })
        }
    },

    SignUp: async(req, res) => {
        let { name, mail, password, photo, role, from } = req.body

        try{
            let user = await User.findOne({mail})
            if(!user){
                let logged = false
                let verified = false
                let code = crypto.randomBytes(15).toString('hex')
                if(from === 'form'){
                    password = bcryptjs.hashSync(password, 10)
                    user = await new User({name, mail, password: [password], photo, from: [from], role, logged, verified, code}).save()
                    sendMail(mail, code)
                    res.status(201).json({
                        message: "Usuario registrado desde formulario con exito",
                        success: true
                    })
                } else {
                    password = bcryptjs.hashSync(password, 10)
                    verified = true
                    user = await new User({name, mail, password: [password], photo, from: [from], role, logged, verified, code}).save()
                    res.status(201).json({
                        message: "Usuario registrado desde " + from + " con exito",
                        success: true
                    })
                }
            } else {
                if (user.from.includes(from)){
                    res.status(302).json({
                        message: "El usuario ya existe",
                        success: false
                    })
                } else {
                    user.from.push(from)
                    user.password.push(bcryptjs.hashSync(password, 10))
                    user.verified = true
                    await user.save()
                    res.status(200).json({
                        message: "Usuario registrado desde " + from + " con exito",
                        success: true
                    })
                }
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, el usuario no se registro",
                success: false
            })
        }
    },

    SignIn: async (req, res) => {
        const {mail, password, from} = req.body
        try{
            let user = await User.findOne({mail})
            if(!user){
                res.status(404).json({
                    message: "Por favor ingresa el correo y la contraseña correctamente",
                    success: false
                })
            } else if(user.verified) {
                const checkPass = user.password.filter(passwordElemnt => bcryptjs.compareSync(password, passwordElemnt))
                if(from === 'form'){
                    if(checkPass.length > 0){
                        let loggedUser = {
                            id: user._id,
                            name: user.name,
                            photo: user.photo,
                            role: user.role
                        }
                        const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: 60*60*24})
                        user.logged = true
                        await user.save()
                        res.status(200).json({
                            message: "Bienvenido " + user.name + "!",
                            response: {user: user, token: token},
                            success: true
                        })
                    } else {
                        res.status(400).json({
                            message: "Usuario o contraseña incorrectos",
                            success: false
                        })
                    }
                } else {
                    if(checkPass.length > 0){
                        let loggedUser = {
                            id: user._id,
                            name: user.name,
                            photo: user.photo,
                            mail: user.mail,
                            role: user.role,
                            from: user.from
                        }
                        const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: 60*60*24})
                        user.logged = true
                        await user.save()
                        res.status(200).json({
                            message: "Bienvenido " + user.name + "!",
                            response: {user: loggedUser, token: token},
                            success: true
                        })
                    } else {
                        res.status(400).json({
                            message: "Usuario o contraseña incorrectos",
                            success: false
                        })
                    }
                }
            } else {
                res.status(401).json({
                    message: "Verifica tu mail y proba de nuevo",
                    success: false
                })
            }
        } catch(error) {
            console.log(error)
            res.status(400).json({
                message: "Error, operación sin exito",
                success: false
            })
        }
    },

    SingOut: async (req, res) => {
        const {mail} = req.body

        try{
            let user = await User.findOne({mail:mail})
            if(user){
                user.logged = false
                await user.save()
                res.status(200).json({
                    message: "Sesion cerrada con exito",
                    response: user.logged,
                    success: true
                })
            } else {
                res.status(404).json({
                    message: "Usuario no encontrado",
                    success: false
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, el cierre de sesion no tuvo exito",
                success: false
            })
        }
    },

    VerifyMail: async (req, res) => {
        const {code} = req.params

        try{
            let user = await User.findOne({code})
            if(user){
                user.verified = true
                await user.save()
                res.redirect(302, 'http://localhost:3000/')
            } else {
                res.status(404).json({
                    message: "El mail no existe",
                    success: false
                })
            }
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Error, mail no verificado",
                success: false
            })
        }
    },

    VerifyToken: async (req, res) => {
        if(req.user !== null) {
            res.status(200).json({
                message: "Bienvenido " + req.user.name + "!",
                response: {
                    user:{
                        id: req.user.id,
                        nombre: req.user.name,
                        mail: req.user.mail,
                        role: req.user.role,
                        foto: req.user.photo
                    }
                },
                success: true
            })
        } else {
            res.json({
                message: "Inicia sesion, por favor",
                success: false
            })
        }
    }
}

module.exports = UserController