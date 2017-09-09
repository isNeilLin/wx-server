const COS = require('cos-nodejs-sdk-v5');
const ENV = process.env.WXAPP ? 'prd' : 'dev';
const password = ENV === 'dev' ? '123456' : 'admin666';
const mysql = {
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: password,
    dbname: 'wxapp'
}
const user = {
    secret: 'dazhangfu',
    appId: '1254089536',
    secretId: 'AKIDoW3Rirgmz0rhVEtLdnmrnaFm7GpNlz5s',
    secretKey: '0vfKqDOPRcehcLsEPPC5oLf0A7uX3Oiv'
}
const baseSrc = 'http://dazhangfu-1254089536.costj.myqcloud.com/'
const basePath = ENV === 'dev' ? '' : '/admin';
const baseParam = {
    Bucket: 'dazhangfu',
    Region: 'cn-north'
}
const cos = new COS({
    AppId: user.appId,
    SecretId: user.secretId,
    SecretKey: user.secretKey
})
module.exports = {
    mysql,
    user,
    cos,
    baseParam,
    baseSrc,
    basePath
}
