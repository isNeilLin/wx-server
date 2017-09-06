const fs = require('fs')
const path = require('path')
const loadModel = require('../db.js')
const articleModel = loadModel('article')
const util = require('../util')
const defaultAvatar = path.join(__dirname,'../public/images/defaultHead.png')

const get = async(ctx, next)=>{
    try{
        const { id } = ctx.query
        if(id){
            const curArticle = await articleModel.findOne({
                where: {
                    id
                }
            })
            if(curArticle){
                ctx.body = {
                    code: 0,
                    data: curArticle
                }
            }else{
                ctx.body = {
                    code: 1,
                    msg: '文章不存在或已被删除'
                }
            }
        }else{
            const articles = await articleModel.findAll()
            ctx.body = {
                code: 0,
                data: articles
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}

const add = async(ctx, next)=>{
    const { title, content } = ctx.request.body
    const avatar = ctx.request.body.avatar ? ctx.request.body.avatar : defaultAvatar
    const create = util.now()
    try{
        let newArticle = await articleModel.create({
            title,
            content,
            avatar,
            create
        })
        ctx.body = {
            code: 0,
            data: {
                id: newArticle.id
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
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
    if(id){
        try{
            let dropArticle = await articleModel.findOne({
                where: {
                    id
                }
            })
            await dropArticle.destroy()
            ctx.body = {
                code: 0,
                msg: '删除成功'
            }
        }catch(e){
            ctx.body = {
                code: 1,
                stack: e.message
            }
        }
    }else{
        ctx.body = {
            code: 1,
            msg: '参数不合法'
        }
    }
}

const update = async(ctx, next)=>{
    const { id, title, content } = ctx.request.body
    const avatar = ctx.request.body.avatar ? ctx.request.body.avatar : defaultAvatar
    try{
        console.log("id: "+id)
        let article = await articleModel.findOne({
            where: {
                id
            }
        }).then(articleInfo=>{
            return articleInfo.update({
                title,
                content,
                avatar
            })
        })
        console.log(article)
        ctx.body = {
            code: 0,
            data: article
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}

module.exports = {
    get,
    add,
    del,
    update
}