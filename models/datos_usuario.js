module.exports = (sequelize, type)=>{
    return sequelize.define('datos_usuario',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        idUsuario:type.INTEGER,
        nombre:type.STRING,
        apellidoPaterno:type.STRING,
        apellidoMaterno:type.STRING,
        numTelefono:type.INTEGER,
        zona:type.STRING,

    });
}