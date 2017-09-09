module.exports = function (sequelize,Datatypes){
    return sequelize.define('collection',{
        id: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        userId: {
            type: Datatypes.INTEGER
        },
        type: {
            type: Datatypes.STRING
        },
        collectionId: {
            type: Datatypes.INTEGER
        },
        create: {
            type: Datatypes.STRING
        }
    },{
        tableName: 'collection'
    })
}