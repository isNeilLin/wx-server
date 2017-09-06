const router = require('koa-router')()
const videoController = require('../controllers/video')
const { basePath } = require('../config');
router.prefix(`${basePath}/video`)
router.get('/',videoController.getSource)
router.post('/add',videoController.add)
router.post('/del',videoController.del)

module.exports = router