const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const multy = require('multy')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('jsonwebtoken')
const cors = require('koa2-cors');
const route = require('./routes')
const { user, basePath } = require('./config');
const secret = user.secret;
onerror(app)

app.use(cors())
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 添加解析form-data中间件
app.use(multy())

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(async(ctx, next) => {
  // 验证Token
  // console.log(`${basePath}/user`)
  console.log('ctx.path')
  console.log(ctx.path)
  if (!ctx.path.startsWith(`${basePath}/user`)&&ctx.path!=`${basePath}`) {
    const token = ctx.query.token || ctx.request.body.token
    console.log(token)
    try {
      let decode = jwt.verify(token, secret)
      ctx.state.user = decode
      await next()
    } catch (e) {
      ctx.status = 401
      ctx.body = {
        code: 1,
        msg: 'Token过期，请重新登录'
      }
    }
  }else{
    await next()
  }
}) 

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// routes
route(app)

module.exports = app
