module.exports = (sequelize, type)=>{
    return sequelize.define('respuestas',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        idAlumno:type.INTEGER,
        idExamen:type.INTEGER,
        respuestas:type.STRING,

    });

}

