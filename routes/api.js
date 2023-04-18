const router = require("express").Router();
const apiUsuarios = require('./api/usuarios');
const apiAlumnos = require('./api/alumnos');
const apiEscuela = require('./api/escuelas');
const apiExamen = require('./api/examenes');
const apiDescarga = require('./api/descargas');

router.use('/usuario', apiUsuarios);
router.use('/examen', apiExamen);
router.use('/escuela', apiEscuela);
router.use('/alumno', apiAlumnos);
router.use('/descarga', apiDescarga);

router.get('/', async (req, res)=>{
    res.send('API-ESCUELAS V0.0.1');
});

module.exports = router;
