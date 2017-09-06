// 音频
module.exports = function(sequelize,Datatypes){
    return sequelize.define('audio',{
        id: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        album_id: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        album_name: {
            type: Datatypes.STRING,
            allowNull: false
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
    },{tableName: 'audio'})
}