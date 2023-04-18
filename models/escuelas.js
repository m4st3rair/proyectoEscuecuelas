module.exports = (sequelize, type)=>{
    return sequelize.define('escuelas',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        idUsuario:type.INTEGER,
        nombre:type.STRING,
        turno:type.STRING,
        clave:type.STRING,
        
    });
}