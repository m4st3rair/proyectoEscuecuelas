const router = require("express").Router();
const {Alumno, ResultadoAlumno, Respuesta} = require('../../db');
const {check, validationResult} = require('express-validator');
const { QueryTypes } = require('sequelize');


router.get('/get-all', async (req, res)=>{
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
});

router.post('/', [
    check('nombre', 'El nombre del alumno es obligatorio').not().isEmpty()
], async(req, res,)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(422).json({errores: errors.array()})
    }


    const alumno = await Alumno.create(req.body);
    res.json(alumno);
});

router.put('/:id', async(req, res)=>{
    await Alumno.update(req.body, {
        where:{ id: req.params.id}
    });

    res.send('Registro Actualizado');
});

router.get('/:id', async(req, res)=>{
    const alumnos = await Alumno.findOne({where:{ id: req.params.id}});
    res.json(alumnos);
});

router.get('/escuela/:idEscuela/:idExamen', async(req, res)=>{

    const{idEscuela, idExamen}= req.params;    
    const alumnos =  await Alumno.findAll({ where:{ idEscuela: idEscuela} });
    const newConsulta = JSON.parse(JSON.stringify(alumnos));
    
    var alumnosSalida=[];    
    for(var i=0; i<newConsulta.length; i++){

        const alumnosRes = await ResultadoAlumno.findOne({where:{ idAlumno: newConsulta[i].id, idExamen:idExamen }, attributes: ['id', 'resultado']});
        if(alumnosRes!= null){

            const newConsulta2 = JSON.parse(JSON.stringify(alumnosRes));
            console.log(newConsulta2);
            newConsulta[i].resultado=newConsulta2.resultado;
    
            const respuestasE = await Respuesta.findOne({
                where:{ idAlumno: newConsulta[i].id, idExamen: idExamen}
            });
            console.log(respuestasE);
            if(respuestasE!= null){
                newConsulta[i].respuestas=JSON.parse(JSON.stringify(respuestasE));
                alumnosSalida.push(newConsulta[i]);
            }

        }

    }

    res.json(alumnosSalida);
});

router.delete('/:id', async(req, res)=>{
    await Alumno.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});



module.exports=router;