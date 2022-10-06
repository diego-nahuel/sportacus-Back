const User = require('../models/User')
const crypto = require('crypto')
const bcryptjs = require('bcryptjs')
// const sendMail = require('./sendMail')
const jwt = require('jsonwebtoken')

const usuarioControlador = {
    crearUsuario: async (req, res) => {
        try{
            let usuario = await new User(req.body).save()
            res.status(201).json({
                message: "Usuario creado con exito",
                response: usuario._id,
                success: true
            })
        } catch(error){
            console.log(error)
            res.status(400).json({
                message: "Usuario no creado",
                success: false
            })
        }
    },

    todosUsuarios: async (req, res) => {
        let query = {}
        let usuarios
        if(req.query.usuarios){
            query.usuarios = req.query.usuarios
        }

        try{
            usuarios = await User.find()
            if(usuarios){
                res.status(200).json({
                    message: "Estos son todos los usuarios",
                    response: usuarios,
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

    unUsuario: async (req, res) => {
        const {id} = req.params

        try{
            let usuario = await User.findOne({_id:id})
            // .populate('canchas', {name:1, city:1})
            if(usuario){
                res.status(200).json({
                    message: "Usuario encontrado",
                    response: usuario,
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

    eliminarUsuario: async (req, res) => {
        const {id} = req.params

        if(req.usario !== null){
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

    editarUsuario: async (req, res) => {
        const {mail} = req.body
        const {role} = req.user

        try{
            if(mail.toString() === mail || role === 'admin'){
                let usuario = await User.findOne({mail:mail})
                if(usuario){
                    let {name, photo, role} = req.body
                    if(role !== 'admin'){
                        usuario = await User.findOneAndUpdate({mail:mail}, {name, photo}, {new:true})
                        res.status(200).json({
                            message: "Usuario editado con exito",
                            response: usuario,
                            success: true
                        })
                    } else if( role == 'admin'){
                        usuario = await User.findOneAndUpdate({mail:mail}, {name, photo}, {new:true})
                        res.status(200).json({
                            message: "Usuario editado con exito",
                            response: usuario,
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

    registrarse: async(req, res) => {
        let { name, mail, password, photo, role, from } = req.body

        try{
            let usuario = await User.findOne({mail})
            if(!usuario){
                let logged = false
                let verified = false
                let role = 'usuario'
                let code = crypto.randomBytes(15).toString('hex')
                if(from === 'formulario'){
                    password = bcryptjs.hashSync(password, 10)
                    usuario = await new User({name, mail, password: [password], photo, from: [from], role, logged, verified, code}).save()
                    sendMail(mail, code)
                    res.status(201).json({
                        message: "Usuario registrado desde formulario con exito",
                        success: true
                    })
                } else {
                    password = bcryptjs.hashSync(password, 10)
                    verified = true
                    usuario = await new User({name, mail, password: [password], photo, from: [from], role, logged, verified, code}).save()
                    res.status(201).json({
                        message: "Usuario registrado desde " + from + " con exito",
                        success: true
                    })
                }
            } else {
                if (usuario.from.includes(from)){
                    res.status(302).json({
                        message: "El usuario ya existe",
                        success: false
                    })
                } else {
                    usuario.from.push(from)
                    usuario.password.push(bcryptjs.hashSync(password, 10))
                    usuario.verified = true
                    await usuario.save()
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

    iniciarSesion: async (req, res) => {
        const {mail, password, from} = req.body
        try{
            let usuario = await User.findOne({mail})
            if(!usuario){
                res.status(404).json({
                    message: "El usuario no existe, por favor registrate",
                    success: false
                })
            } else if(usuario.verified) {
                const checkPass = usuario.password.filter(passwordElemnt => bcryptjs.compareSync(password, passwordElemnt))
                if(from === 'formulario'){
                    if(checkPass.length > 0){
                        let usuarioLogeado = {
                            id: usuario._id,
                            name: usuario.name,
                            photo: usuario.photo,
                            role: usuario.role
                        }
                        const token = jwt.sign({id: usuario._id}, process.env.JWT_TOKEN, {expiresIn: 60*60*24})
                        usuario.logged = true
                        await usuario.save()
                        res.status(200).json({
                            message: "Bienvenido " + usuario.name + "!",
                            response: {token: token},
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
                        let usuarioLogeado = {
                            id: usuario._id,
                            name: usuario.name,
                            photo: usuario.photo,
                            mail: usuario.mail,
                            role: usuario.role,
                            from: usuario.from
                        }
                        usuario.logged = true
                        await usuario.save()
                        res.status(200).json({
                            message: "Bienvenido " + usuario.name + "!",
                            response: {usuario: usuarioLogeado},
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
                message: "Error, operacion sin exito",
                success: false
            })
        }
    },

    cerrarSesion: async (req, res) => {
        const {mail} = req.body

        try{
            let usuario = await User.findOne({mail:mail})
            if(usuario){
                usuario.logged = false
                await usuario.save()
                res.status(200).json({
                    message: "Sesion cerrada con exito",
                    response: usuario.logged,
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

    verificarMail: async (req, res) => {
        const {code} = req.params

        try{
            let usuario = await User.findOne({code})
            if(usuario){
                usuario.verified = true
                await usuario.save()
                res.redirect(302, 'http://localhost:4000/')
            } else {
                res.status(404).json({
                    message: "No se pudo verificar el mail",
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

    verificarToken: async (req, res) => {
        if(req.usuario !== null) {
            res.status(200).json({
                message: "Bienvenido " + req.usuario.name + "!",
                response: {
                    usuario:{
                        id: req.usuario.id,
                        nombre: req.usuario.name,
                        mail: req.usuario.mail,
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

module.exports = usuarioControlador