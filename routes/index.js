var express = require('express');
var router = express.Router();
const canchasRouter = require('./Canchas')
const comentariosRouter = require('./Comentario')
const usuarioRouter = require('./Usuario')
const productRouter = require('./producto')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sportacus' });
});


router.use('/canchas', canchasRouter)
router.use('/comentarios', comentariosRouter)
router.use('/usuarios', usuarioRouter)
router.use('/products', productRouter)
module.exports = router;
