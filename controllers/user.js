const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const loadModel = require('../db.js')
const userModel = loadModel('user')
const util = require('../util')
const { user } = require('../config')
const secret = user.secret;

const getHashPwd = (password) => {
  return crypto.createHash('md5').update(password).digest('hex')
}
// 检查密码
const checkPassword = (password) => {
  let charOrNumber = /[A-z]*[a-zA-Z][0-9][A-z0-9]*/.test(password)
  if (!password) {
    return '密码不可为空'
  }
  if (password.length < 8 || password.length > 20) {
    return '密码长度须在8-20位之间'
  }
  if (!charOrNumber) {
    return '密码须包含字母和数字'
  }
  return false
}

// 检查昵称
const checkNickname = (nickname) => {
  return new Promise(async (resolve, reject) => {
    if (!nickname) {
      resolve('昵称不可为空')
    }
    if (nickname.length < 3 || nickname.length > 16) {
      resolve('昵称长度在3-16位之间')
    }
    if (/^[0-9]*$/.test(nickname)) {
      resolve('昵称不能为纯数字')
    }
    try {
      let res = await userModel.findOne({
        where: {
          username: nickname
        }
      })
      if (res) {
        resolve('该昵称已被注册')
      } else {
        resolve(false)
      }
    } catch (e) {
      resolve('数据库查询失败')
    }
  })
}

//检查权限
const checkAccess = (username) => {
    return new Promise(async(resolve, reject)=>{
        userModel.findOne({
            where: {
                username
            }
        }).then(userInfo=>{
            resolve(userInfo.access)
        })
    })
}

const createToken = (payload) => {
  return jwt.sign(payload, secret, {expiresIn: '2h'})
}

const getAll = async(ctx, next)=>{
    try{
        const users = await userModel.findAll();
        if(users){
            ctx.body = {
                code: 0,
                data: users
            }
        }else{
            ctx.body = {
                code: 1,
                msg: '查询失败'
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '查询失败',
            stack: e
        }
    }
}

const getOne = async(ctx, next)=>{
    const { id } = ctx.request.body;
    try{
        const user = await userModel.findOne({
            where: {
                id
            }
        });
        if(user){
            ctx.body = {
                code: 0,
                data: users
            }
        }else{
            ctx.body = {
                code: 1,
                msg: '查询失败'
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '查询失败',
            stack: e
        }
    }
}

const update = async(ctx, next)=>{
    const { id, oldPwd, password } = ctx.request.body;
    let msg = ''
    const pwdResult = checkPassword(password)
    if (pwdResult) {
        msg = pwdResult
    }
    if(msg){
        ctx.body = {
            code: 1,
            msg: msg
        }
        return
    }
    const hashPwd = getHashPwd(password)
    const oldHashPwd = getHashPwd(oldPwd)
    try{
        const user = await userModel.findById(id)
        if(oldHashPwd!==user.password){
            ctx.body = {
                code: 1,
                msg: '原始密码错误'
            }
            return
        }
        const result = await user.update({
            password: hashPwd
        })
        console.log(result)
        if(result){
            ctx.body = {
                code: 0,
                msg: '更新成功'
            }
        }else{
            ctx.body = {
                code: 1,
                msg: '更新失败'
            }
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '更新失败',
            stack: e
        }
    }
}

const del = async(ctx, next)=>{
    const { id, access } = ctx.request.body
    if(access!==1){
        ctx.body = {
            code: 1,
            msg: '没有添加用户权限'
        }
        return
    }
    try{
        const user = userModel.findById(id)
        await user.destroy()
        ctx.body = {
            code: 0,
            msg: '删除成功'
        }
    }catch(e){
        ctx.body = {
            code: 1,
            msg: '删除失败',
            stack: e
        }
    }
}

const login = async(ctx, next)=>{
    const { username, password } = ctx.request.body;
    console.log(username, password)
    const user = await userModel.findOne({
        where: {
            username
        }
    })
    if(!user){
        ctx.body = {
            code: 1,
            msg: '不存在该用户'
        }
        return
    }
    if(!password || !username){
        ctx.body = {
            code: 1,
            msg: '参数不合法',
            data: ctx.request.body
        }
        return
    }
    const hashPwd = getHashPwd(password)
    if(user.username != username || user.password != hashPwd){
        ctx.body = {
            code: 1,
            msg: '账号或密码错误'
        }
    }else{
        let now = util.now()
        let payload = {
            name: username,
            password: hashPwd,
            access: user.access,
            loginTime: now
        }
        let token = createToken(payload)
        ctx.body = {
            code: 0,
            msg: '登录成功',
            access: user.access,
            id: user.id,
            token: token
        }
    }
}

const register = async(ctx, next)=>{
    const { username, password, access, sender } = ctx.request.body
    let msg = ''
    const pwdResult = checkPassword(password)
    const nameResult = await checkNickname(username)
    const senderAccess = await checkAccess(sender)
    // 校验各字段
    console.log(senderAccess)
    if(senderAccess!==1){
        msg = '没有添加用户权限'
    }else if (pwdResult) {
        msg = pwdResult
    } else if (nameResult) {
        msg = nameResult
    }
    if(msg){
        ctx.body = {
            code: 1,
            msg: msg
        }
        return
    }
    const hashPwd = getHashPwd(password)
    const create = util.now()
    try{
        const newUser = await userModel.create({
            username:username,
            password: hashPwd,
            access: access,
            create: create
        })
        ctx.body = {
            code: 0,
            msg: '注册成功'
        }
    }catch(e){
        ctx.body = {
            code: 1,
            stack: e.message
        }
    }
}
module.exports = {
    login,
    register,
    getAll,
    getOne,
    update,
    del
}