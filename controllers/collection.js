const fs = require('fs')
const path = require('path')
const loadModel = require('../db.js')
const collectionModel = loadModel('collection')
const util = require('../util')

const getAll = async(ctx, next)=>{
    const { id } = ctx.query
    if(!id){
        ctx.body = {
            code: 1,
            msg: '请先登录'
        }
        return
    }
    try{
        const collections = await collectionModel.findAll({
            where: {
                userId: id
            }
        })
        if(collections.length){
            ctx.body = {
                code: 0,
                data: collections
            }
        }else{
            ctx.body = {
                code: 1,
                msg: '暂无收藏'
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e,
            msg: '查询失败'
        }
    }
}

const add = async(ctx, next)=>{
    const { userId, type, id } = ctx.request.body
    try{
        let collection = await collectionModel.create({
            userId: userId,
            type: type,
            collectionId: id,
            create: util.now()
        })
        ctx.body = {
            code: 0,
            msg: '添加成功',
            data: collection
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '添加失败',
            stack: e
        }
    }
}

const del = async(ctx, next)=>{
    const { userId, id } = ctx.request.body
    try{
        let collection = await collectionModel.findById(id)
        if(collection&&collection.userId==userId){
            await collection.destroy()
            ctx.body = {
                code: 0,
                msg: '删除成功'
            }
        }else{
            ctx.body = {
                code: 1,
                msg: '删除失败'
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '删除失败',
            stack: e
        }
    }
}

module.exports = {
    getAll,
    add,
    del
}