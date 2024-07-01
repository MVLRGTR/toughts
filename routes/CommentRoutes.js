const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const CheckAuth = require('../helpers/auth').CheckAuth

router.get('/add/:idtought',CheckAuth,CommentController.AddComment)
router.post('/add',CheckAuth,CommentController.AddCommentPost)

router.get('/:idtought',CommentController.ShowCommentsToughtId)

module.exports = router
