// 音频专辑表
module.exports = function(sequelize,Datatypes){
    return sequelize.define('album', {
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
        profile: {
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
    },{tableName: 'album'})
}