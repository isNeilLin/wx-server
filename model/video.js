// 音频
module.exports = function(sequelize,Datatypes){
    return sequelize.define('video',{
        id: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: Datatypes.STRING,
            allowNull: false
        },
        src: {
            type: Datatypes.STRING,
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
    },{tableName: 'video'})
}