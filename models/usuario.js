module.exports = (sequelize, type)=>{
    return sequelize.define('usuarios',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userName:{type : type.STRING,  required : true, allowNull: false } ,
        password:type.STRING,
        correo: type.STRING,
        tipo:type.STRING,
    });
}

/*Los tipos:
    SUPERVISOR
    DIRECTOR
    MAESTRO
    ADMINISTRATIVO
    INTENDENCIA
*/