var express = require('express');
var router = express.Router();
let passport = require('../config/passport')
let adminPassport = require('../config/adminPassport')
const {
        AllUsers,
        OneUser,
        DeleteUser,
        UpdateUser,
        SignUp,
        SignIn,
        SingOut,
        VerifyMail,
        VerifyToken} = require('../controllers/UserController')

        router.get('/', AllUsers)
        router.get('/:id', OneUser)
        router.delete('/:id', adminPassport.authenticate('jwt', {session: false}), DeleteUser)
        router.patch('/:id', adminPassport.authenticate('jwt', {session: false}), UpdateUser)
        router.post('/signup', SignUp)
        router.post('/signin', SignIn)
        router.post('/signout', SingOut)
        router.get('/verify/:code', VerifyMail)
        router.get('/token', passport.authenticate('jwt', {session: false}), VerifyToken)

        module.exports = router