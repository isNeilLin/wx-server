const router = require('koa-router')()
const userController = require('../controllers/user')
const { basePath } = require('../config');
router.all(`${basePath}/`,(ctx, next)=>{
    ctx.redirect(`${basePath}/user`)
})
router.get(`${basePath}/user/getAll`,userController.getAll)
router.post(`${basePath}/user/me`,userController.getOne)
router.post(`${basePath}/user/del`,userController.del)
router.post(`${basePath}/user/update`,userController.update)
router.post(`${basePath}/user/login`, userController.login)
router.post(`${basePath}/user/register`, userController.register)

module.exports = router
