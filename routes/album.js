const router = require('koa-router')()
const albumController = require('../controllers/album')
const { basePath } = require('../config');
router.prefix(`${basePath}/album`)
router.get('/', albumController.getAll)
router.get('/one',albumController.getOne)
router.post('/add',albumController.add)
router.post('/del',albumController.del)
router.post('/update',albumController.update)

module.exports = router
