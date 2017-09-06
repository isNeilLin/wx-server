const router = require('koa-router')()
const audioController = require('../controllers/audio')
const { basePath } = require('../config');
router.prefix(`${basePath}/audio`)
router.get('/',audioController.getSource)
router.post('/add',audioController.add)
router.post('/del',audioController.del)

module.exports = router