var express = require('express')
var router = express.Router()
const passport = require('../config/passport')
const {CreateComment,
    AllComments,
    OneComment,
    UpdateComment,
    DeleteComment,
} = require('../controllers/CommentController')

router.post('/', passport.authenticate('jwt', {session: false}), CreateComment)
router.get('/', AllComments)
router.get('/:id', passport.authenticate('jwt', {session: false}), OneComment)
router.patch('/:id', passport.authenticate('jwt', {session: false}), UpdateComment)
router.delete('/:id', passport.authenticate('jwt', {session: false}), DeleteComment)

module.exports = router