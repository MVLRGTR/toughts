const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/login',AuthController.AuthLogin)
router.post('/login',AuthController.AuthLoginPost)

router.get('/loginprimary',AuthController.AuthLoginPrimary)
router.post('/loginprimary',AuthController.AuthLoginPrimaryPost)

router.get('/register',AuthController.AuthRegister)
router.post('/register',AuthController.AuthRegisterPost)

router.get('/logout',AuthController.Logout)

module.exports = router