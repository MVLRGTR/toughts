const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const CheckAuth = require('../helpers/auth').CheckAuth

router.get('/add/:idtought',CheckAuth,CommentController.AddComment)
router.post('/add',CheckAuth,CommentController.AddCommentPost)

router.get('/edit/:idcomment',CheckAuth,CommentController.EditComment)
router.post('/edit',CheckAuth,CommentController.EditCommentPost)

router.post('/delete',CheckAuth,CommentController.DeleteComment)

router.get('/:idtought',CommentController.ShowCommentsToughtId)

module.exports = router
