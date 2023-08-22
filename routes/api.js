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


router.get('/webhook/', async (req, res)=>{
    console.log("get");
    console.log(req);
    res.send('OK');
});
router.put('/webhook/', async (req, res)=>{    
    console.log("put");
    console.log(req);
    res.send('OK');
});
router.post('/webhook/', async (req, res)=>{
    console.log("post");
    console.log(req);
    res.send('OK');
});
router.delete('/webhook/', async (req, res)=>{
    console.log("delete");
    console.log(req);
    res.send('OK');
});

module.exports = router;
