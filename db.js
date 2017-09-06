const path = require('path');
const Sequelize = require('sequelize');
const mysqlConf = require('./config').mysql;
let db = new Sequelize(mysqlConf.dbname, mysqlConf.username, mysqlConf.password, {
    host: mysqlConf.host,
    port: mysqlConf.port,
    define: {
        timestamps: false
    },
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4'
    },
});

module.exports = function(name) {
    let model = db.import(path.resolve('model',name));
    db.sync(); // 同步模型到数据库中
    return model;
}