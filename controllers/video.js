const fs = require('fs')
const path = require('path')
const loadModel = require('../db.js')
const videoModel = loadModel('video')
const util = require('../util')
const defaultAvatar = path.join(__dirname,'../public/images/defaultHead.png')
const { cos, baseParam, baseSrc } = require('../config')

const getSource = async (ctx, next)=>{
    const { id } = ctx.query
    try {
        if(id){
            const video = await videoModel.findOne({
                where: {
                    id
                }
            })
            if(video){
                ctx.body = {
                    code: 0,
                    data: video
                }
            }else{
                ctx.body = {
                    code: 1,
                    msg: '资源不存在'
                }
            }
        }else{
            const videos = await videoModel.findAll()
            console.log(videos)
            ctx.body = {
                code: 0,
                data: videos
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}

const add = async (ctx, next)=>{
    const { file } = ctx.request.body
    console.log(file)
    try{
        const saved = await saveVideo(ctx, file)
        console.log(saved)
        if(saved.code===0){
            ctx.body = {
                code: 0,
                msg: "上传成功",
                data: saved.src
            }
        }else{
            ctx.body = saved
        }
    }catch(e){
        console.log(e)
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}

const saveVideo = (ctx, video)=>{
    return new Promise((resolve, reject)=>{
        const { name, mimetype } = video
        console.log(mimetype)
        if(mimetype.indexOf('video')==-1){
            resolve({
                code: 1,
                msg: '文件格式错误'
            })
        }
        let tmpPath = path.join(__dirname,`../tmpFile/${name}`);
        let wr = fs.createWriteStream(tmpPath);
        video.pipe(wr);
        wr.on('finish',function(){
            let tmp = fs.createReadStream(tmpPath);
            let size = fs.statSync(tmpPath).size;
            let location = `videos/${name}`;
            let param = Object.assign({},baseParam,{
                Key: location,
                Body: tmp,
                ContentType: 'application/octet-stream',
                ContentLength: size,
                onProgress: function (progressData) {
                    res.write(progressData)
                }
            })
            cos.putObject(param,function(err,data){
                if(err){
                    console.log(err)
                    reject(err)
                }
                const create = util.now()
                const avatar = defaultAvatar
                const src = baseSrc+location
                videoModel.create({
                    name: name,
                    src: src,
                    avatar: avatar,
                    create: create
                })
                fs.unlinkSync(tmpPath);
                resolve({
                    code: 0,
                    src: src
                })
            })
        })
        wr.on('error',function(e){
            reject(e.stack)
        })
    })
}
const del = async(ctx, next)=>{
    const { id } = ctx.request.body
    //检查权限
    if(ctx.state.user.access!==1){
        ctx.body = {
            code: 1,
            msg: '没有删除权限'
        }
        return
    }
    if(!id){
        ctx.body = {
            code: 1,
            msg: "参数错误"
        }
        return false
    }
    try{
        const dropVideo = await videoModel.findOne({
            where: {
                id
            }
        })
        await dropVideo.destroy()
        ctx.body = {
            code: 0,
            msg: "删除成功"
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}


module.exports = {
    getSource,
    add,
    del
}