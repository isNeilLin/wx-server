const user = require('./users')
const album = require('./album')
const audio = require('./audio')
const video = require('./video')
const article = require('./article')
const collection = require('./collection')

module.exports = app => {
  app.use(user.routes(), user.allowedMethods()),
  app.use(album.routes(), album.allowedMethods()),
  app.use(audio.routes(), audio.allowedMethods()),
  app.use(video.routes(), video.allowedMethods()),
  app.use(article.routes(),article.allowedMethods()),
  app.use(collection.routes(),collection.allowedMethods())
}