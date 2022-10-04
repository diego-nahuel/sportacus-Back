const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const {crearComentario,
    todosComentarios,
    unComentario,
    editarComentario,
    eliminarComentario,
} = require('../controllers/ComentarioController')

router.post('/', passport.authenticate('jwt', {session: false}), crearComentario)
router.get('/', todosComentarios)
router.get('/:id', passport.authenticate('jwt', {session: false}), unComentario)
router.patch('/:id', passport.authenticate('jwt', {session: false}), editarComentario)
router.delete('/:id', passport.authenticate('jwt', {session: false}), eliminarComentario)

module.exports = router