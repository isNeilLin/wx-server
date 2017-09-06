// 图文
module.exports = function(sequelize,Datatypes){
    return sequelize.define('article',{
        id: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: Datatypes.STRING,
            allowNull: false
        },
        content: {
            type: Datatypes.TEXT,
            allowNull: false
        },
        avatar: {
            type: Datatypes.STRING,
            allowNull: false
        },
        create: {
            type: Datatypes.STRING,
            allowNull: false
        }
    },{tableName: 'article'})
}