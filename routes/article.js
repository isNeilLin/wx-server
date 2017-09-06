const router = require('koa-router')()
const articleController = require('../controllers/article')
const { basePath } = require('../config');
router.prefix(`${basePath}/article`)
router.get('/', articleController.get)
router.post('/add',articleController.add)
router.post('/del',articleController.del)
router.post('/update',articleController.update)

module.exports = router