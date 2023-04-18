module.exports = (sequelize, type)=>{
    return sequelize.define('examenes',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        nombre:type.STRING,
        nivel:type.STRING,
        idUsuario:type.INTEGER,
        grado:type.INTEGER,
        estatus:type.STRING,
        noPreguntas:type.INTEGER,

    });

}

/*
LOS NIVELES SON:
    ZONA
    ESCUELA
    GRUPO 
LOS ESTATUS SON:
    NUEVO
    TERMINADO
*/