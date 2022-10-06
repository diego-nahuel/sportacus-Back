var express = require('express');
var router = express.Router();
const fieldsRouter = require('./Fields')
const commentsRouter = require('./Comments')
const usersRouter = require('./Auth')
const productRouter = require('./product')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sportacus' });
});


router.use('/fields', fieldsRouter)
router.use('/comments', commentsRouter)
router.use('/users', usersRouter)
router.use('/products', productRouter)
module.exports = router;
