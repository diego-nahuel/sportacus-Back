var express = require('express')
var router = express.Router()

const {create, update, destroy, all, readOne} = require('../controllers/ProductsController')

router.post('/', create)
router.patch('/:id', update)
router.delete('/:id', destroy)
router.get('/', all)
router.get('/:id', readOne)

module.exports = router

