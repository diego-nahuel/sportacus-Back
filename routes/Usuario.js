var express = require('express');
var router = express.Router();
let passport = require('../config/passport')
let adminPassport = require('../config/adminPassport')
const {crearUsuario,
        todosUsuarios,
        unUsuario,
        eliminarUsuario,
        editarUsuario,
        registrarse,
        iniciarSesion,
        cerrarSesion,
        verificarMail,
        verificarToken} = require('../controllers/UsuarioControlador')

       // router.post('/', crearUsuario)
        router.get('/', todosUsuarios)
        router.get('/:id', unUsuario)
        router.delete('/:id', adminPassport.authenticate('jwt', {session: false}), eliminarUsuario)
        router.patch('/:id', adminPassport.authenticate('jwt', {session: false}), editarUsuario)
        router.post('/signup', registrarse)
        router.post('/signin', iniciarSesion)
        router.post('/signout', cerrarSesion)
        router.get('/verify/:code', verificarMail)
        router.get('/token', passport.authenticate('jwt', {session: false}), verificarToken)

        module.exports = router