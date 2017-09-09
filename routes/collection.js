const router = require('koa-router')()
const collectionController = require('../controllers/collection')
const { basePath } = require('../config');
router.prefix(`${basePath}/collection`)
router.get('/',collectionController.getAll)
router.post('/add',collectionController.add)
router.post('/del',collectionController.del)

module.exports = router