const express = require('express')
const router = express.Router()
let passport = require('../config/passport')

const {crearCancha,
    editarCancha,
    EliminarCancha,
    TodasCanchas,
    UnaCancha,
    likeDislike,
    porUsuario} = require('../controllers/CanchasControllers')

    router.post('/', passport.authenticate('jwt', {session: false}), crearCancha)
    router.patch('/:id', passport.authenticate('jwt', {session: false}), editarCancha)
    router.delete('/:id', passport.authenticate('jwt', {session: false}), EliminarCancha)
    router.get('/', TodasCanchas)
    router.get('/:id', passport.authenticate('jwt', {session: false}), UnaCancha)
    router.patch('/likes/:canchaId', passport.authenticate('jwt', {session: false}, likeDislike))
    router.get('/usuario/:id', passport.authenticate('jwt', {session: false}), porUsuario)

    module.exports = router