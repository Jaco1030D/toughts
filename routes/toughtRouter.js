const express = require('express');
const ToughtsController = require('../controllers/ToughtsController');
const { checkauth } = require('../helpers/auth');
const router = express.Router()



router.get('/add', checkauth, ToughtsController.createTought)
router.post('/add', checkauth, ToughtsController.createToughtSave)
router.get('/edit/:id', checkauth, ToughtsController.updatetought)
router.post('/edit', checkauth, ToughtsController.updatetoughtSave)
router.get('/dashboard', checkauth, ToughtsController.dashboard)
router.post('/remove', checkauth, ToughtsController.RemoveTought)
router.get('/', ToughtsController.showtoughts)

module.exports = router;