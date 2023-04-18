module.exports = (sequelize, type)=>{
    return sequelize.define('alumnos',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        nombre:type.STRING,
        apellidoMaterno:type.STRING,
        apellidoPaterno:type.STRING,
        idEscuela:type.INTEGER,
//        idExamen:type.INTEGER,
        //curp:type.STRING,
    });
}