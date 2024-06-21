const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtController')
const CheckAuth = require('../helpers/auth').CheckAuth

router.get('/add',CheckAuth,ToughtsController.AddToughts)
router.post('/add',CheckAuth,ToughtsController.AddToughtsPost)

router.get('/edit/:idtought',CheckAuth,ToughtsController.EditToughts)
router.post('/edit',CheckAuth,ToughtsController.EditToughtsSave)

router.post('/delete',CheckAuth,ToughtsController.DeleteTought)

router.get('/dashboard',CheckAuth,ToughtsController.Dashboard)

router.get('/',ToughtsController.ShowAllToughts)


module.exports = router