module.exports = (sequelize, type)=>{
    return sequelize.define('escuelas_examenes',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        calificado:type.STRING,
        idEscuela:type.INTEGER,
        promedio:type.FLOAT,
        noAlumnos:type.INTEGER,
        idExamen:type.INTEGER,
    });
}