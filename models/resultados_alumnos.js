module.exports = (sequelize, type)=>{
    return sequelize.define('resultados_alumnos',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },

        idAlumno:type.INTEGER,
        idExamen:type.INTEGER,
        resultado:type.INTEGER, 
    });

}

