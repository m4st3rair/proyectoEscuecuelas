const Sequelize = require('sequelize');
const AlumnoModel = require('./models/alumnos');
const UsuarioModel = require('./models/usuario');
const DatosUsuarioModel = require('./models/datos_usuario');
const EscuelasModel = require('./models/escuelas');
const ExamenesModel = require('./models/examenes');
const RespuestaModel = require('./models/respuestas');
const ResultadoAlumnoModel = require('./models/resultados_alumnos');
const EscuelasExamenesModel = require('./models/escuelas_examenes');


//inicia el conection
const sequelize = new Sequelize('plataforma_supervisor_v1', 'root', '', {
    host:'localhost' ,
    dialect:'mysql'
});


//Se crean los modelos

const Alumno = AlumnoModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const DatosUsuario = DatosUsuarioModel(sequelize, Sequelize);
const Escuela = EscuelasModel(sequelize, Sequelize);
const Examenes = ExamenesModel(sequelize, Sequelize);
const Respuesta = RespuestaModel(sequelize, Sequelize);
const EscuelaExamen = EscuelasExamenesModel(sequelize, Sequelize);
const ResultadoAlumno = ResultadoAlumnoModel(sequelize, Sequelize);




sequelize.sync({force:false}).then(()=>{
    console.log("Tablas Creadas");
});

//Se exportan los modelos
module.exports={
    Alumno,
    Usuario,
    DatosUsuario,
    Escuela,
    Examenes,
    Respuesta,
    ResultadoAlumno,
    EscuelaExamen,
}
