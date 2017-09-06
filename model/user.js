module.exports = function (sequelize,Datatypes){
    return sequelize.define('user',{
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
        password: {
            type: Datatypes.STRING
        },
        access: {
            type: Datatypes.INTEGER
        },
        create: {
            type: Datatypes.STRING
        }
    },{
        tableName: 'user'
    })
}