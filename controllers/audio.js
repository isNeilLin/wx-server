const fs = require('fs')
const path = require('path')
const loadModel = require('../db.js')
const audioModel = loadModel('audio')
const util = require('../util')
const defaultAvatar = path.join(__dirname,'../public/images/defaultHead.png')
const { cos, baseParam, baseSrc } = require('../config')

const getSource = async (ctx, next)=>{
    const { id } = ctx.query
    if(id){
        try {
            const audio = await audioModel.findOne({
                where: {
                    id
                }
            })
            console.log(audio)
            ctx.body = {
                code: 0,
                data: audio
            }
        }catch(e){
            ctx.body = {
                code: 1,
                stack: e
            }
        }
    }else{
        try {
            const audios = await audioModel.findAll()
            console.log(audios)
            ctx.body = {
                code: 0,
                data: audios
            }
        }catch(e){
            ctx.body = {
                code: 1,
                stack: e
            }
        }
    }
}

const add = async (ctx, next)=>{
    const { id, file, album_name } = ctx.request.body
    console.log(id)
    console.log(album_name)
    console.log(file)
    let errorMsg
    try{
        const avatar = defaultAvatar
        let saved
        if(Array.isArray(file)){
            console.log('array')
            const saveAll = file.map(singleAudio=>{
                if(singleAudio.code===1){
                    errorMsg = singleAudio
                }
                return saveAudio(ctx, singleAudio, id)
            })
            saved = await Promise.all(saveAll)
        }else{
            let singleResult = await saveAudio(ctx, file, id)
            if(singleResult.code===1){
                errorMsg = singleResult
            }
            saved = [singleResult]
        }
        if(errorMsg){
            ctx.body = errorMsg
            return
        }
        const writeToDB = saved.map(res=>{
            const create = util.now()
            return audioModel.create({
                album_id: id,
                name: res.name,
                src: res.src,
                album_name: album_name,
                avatar: avatar,
                create: create
            })
        })
        ctx.body = {
            code: 0,
            msg: "上传成功",
            data: saved
        }
    }catch(e){
        console.log(e)
        ctx.body = {
            code: 1,
            stack: e
        }
    }
}

const saveAudio = (ctx, audio, id)=>{
    return new Promise((resolve, reject)=>{
        const { name, mimetype } = audio
        if(!mimetype || mimetype.indexOf('audio')==-1){
            resolve({
                code: 1,
                msg: '文件格式错误'
            })
        }
        let tmpPath = path.join(__dirname,`../tmpFile/${name}`);
        let wr = fs.createWriteStream(tmpPath);
        audio.pipe(wr);
        wr.on('finish',function(){
            let tmp = fs.createReadStream(tmpPath);
            let size = fs.statSync(tmpPath).size;
            let location = `audios/${name}`;
            let param = Object.assign({},baseParam,{
                Key: location,
                Body: tmp,
                ContentType: 'application/octet-stream',
                ContentLength: size,
                onProgress: function (progressData) {
                    console.log(progressData);
                }
            })
            cos.putObject(param,function(err,data){
                if(err){
                    console.log(err)
                    reject(err)
                }
                fs.unlinkSync(tmpPath);
                resolve({
                    name: name,
                    src: baseSrc+location
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
        const dropAudio = await audioModel.findOne({
            where: {
                id
            }
        })
        await dropAudio.destroy()
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