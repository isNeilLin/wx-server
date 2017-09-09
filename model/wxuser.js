module.exports = function (sequelize,Datatypes){
    return sequelize.define('wxuser',{
        id: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        username: {
            type: Datatypes.STRING,
            unqiue: true
        },
        access: {
            type: Datatypes.INTEGER,
            defaultValue: 2
        },
        create: {
            type: Datatypes.STRING
        }
    },{
        tableName: 'wxuser'
    })
}