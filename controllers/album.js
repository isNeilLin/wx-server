const fs = require('fs')
const path = require('path')
const loadModel = require('../db.js')
const albumModel = loadModel('album')
const audioModel = loadModel('audio')
const util = require('../util')
const defaultAvatar = path.join(__dirname,'../public/images/defaultHead.png')

const saveImg = (ctx)=>{
    return new Promise((resolve, reject) => {
    let { avatar } = ctx.request.body
    let { name, mimetype } = avatar
    if (mimetype.indexOf('image') === -1) {
      resolve({
        code: 400,
        msg: '文件格式错误'
      })
    }
    let publicPath = `public/images/avatar`
    let savePath = path.resolve(publicPath, name)
    let serverPath = path.join(ctx.host, publicPath, name)
    // 如果没有该文件夹，就创建一个
    console.log(savePath)
    if (!fs.existsSync(path.resolve(publicPath))) {
      fs.mkdirSync(path.resolve(publicPath))
    }
    avatar.pipe(fs.createWriteStream(savePath))
    avatar.on('end', () => {
      resolve({
          src: serverPath
      })
    })
    avatar.on('error', (err) => {
      resolve({
        msg: '上传失败'
      })
    })
  })
}

const getAll = async (ctx, next)=>{
    try{
        let { id } = ctx.query
        if(id){
            const audios = await audioModel.findAll({
                where: {
                    album_id: id
                }
            })
            console.log(audios)
            ctx.body = {
                code: 0,
                data: audios
            }
        }else{
            const albums = await albumModel.findAll()
            console.log(albums)
            ctx.body = {
                code: 0,
                data: albums
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}

const getOne = async(ctx, next)=>{
    try{
        let { id } = ctx.query
        const albumData = await albumModel.findOne({
            where: {
                id
            }
        })
        ctx.body = {
            code: 0,
            data: albumData
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}

const add = async (ctx, next)=>{
    let { title,profile } = ctx.request.body
    let create = util.now()
    try{
        if(ctx.request.body.avatar){
            result = await saveImg(ctx)
            if(!result.src){
                throw new Error(result.msg)
            }else{  
                avatar = result.src
            }
        }else{
            avatar = defaultAvatar
        }
        let newAlbum = await albumModel.create({
            title: title,
            profile: profile,
            avatar: avatar,
            create: create
        })
        ctx.body = {
            code: 0,
            data: newAlbum
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}

const del = async (ctx, next)=>{
    let { id } = ctx.request.body
    //检查权限
    if(ctx.state.user.access!==1){
        ctx.body = {
            code: 1,
            msg: '没有删除权限'
        }
        return
    }
    try{
        let dropAlbum = await albumModel.findOne({
            where: {
                id
            }
        })
        await dropAlbum.destroy()
        ctx.body = {
            code: 0,
            msg: '删除成功'
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}

const update = async (ctx, next)=>{
    let { id, title, profile } = ctx.request.body
    try{
        if(ctx.request.body.avatar){
            result = await saveImg(ctx)
            if(!result.src){
                throw new Error(result.msg)
            }else{  
                avatar = result.src
            }
        }else{
            avatar = defaultAvatar
        }
        let albumInfo = await albumModel.findOne({
            where: {
                id
            }
        })
        albumInfo = await albumInfo.update({
            title,
            profile,
            avatar
        })
        ctx.body = {
            code: 0,
            data: albumInfo
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}

module.exports = {
    getAll,
    getOne,
    add,
    del,
    update
}