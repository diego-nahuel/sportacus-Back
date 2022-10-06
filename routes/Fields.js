const express = require('express')
const router = express.Router()
let passport = require('../config/passport')

const {CreateField,
    UpdateField,
    DeleteField,
    AllFields,
    OneField,
    likeDislike,
    ByUser} = require('../controllers/FieldsController')

    router.post('/', CreateField)
    router.patch('/:id', passport.authenticate('jwt', {session: false}), UpdateField)
    router.delete('/:id', passport.authenticate('jwt', {session: false}), DeleteField)
    router.get('/', AllFields)
    router.get('/:id', OneField)
    router.patch('/likes/:canchaId', passport.authenticate('jwt', {session: false}, likeDislike))
    router.get('/usuario/:id', passport.authenticate('jwt', {session: false}), ByUser)

    module.exports = router