var express = require('express');
var router = express.Router();
const canchasRouter = require('./Canchas')
const comentariosRouter = require('./Comentario')
const usuarioRouter = require('./Usuario')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sportacus' });
});


router.use('/canchas', canchasRouter)
router.use('/comentarios', comentariosRouter)
router.use('/usuarios', usuarioRouter)
module.exports = router;
