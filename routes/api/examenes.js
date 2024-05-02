const router = require("express").Router();
const {Examenes, Respuesta, EscuelaExamen, ResultadoAlumno, Alumno, Escuela} = require('../../db');
const {check, validationResult} = require('express-validator');


router.get('/get-all', async (req, res)=>{
    const examenes = await Examenes.findAll();
    res.json(examenes);
});

router.post('/', 
//[    check('nombre', 'El nombre del Examen es obligatorio').not().isEmpty() ], 
async(req, res,)=>{
    const errors = validationResult(req);
//    if(!errors.isEmpty() ){        return res.status(422).json({errores: errors.array()})}
    const examen = await Examenes.create(req.body);
    
    console.log(examen);
    const {preguntas} = req.body;
    console.log("preguntas");

    var preguntasList=[];
    for(var i = 0 ; i<preguntas.length; i++ ){
        preguntasList.push(preguntas[i].respuesta);
    }
    const respuesta = await Respuesta.create({'idAlumno': -1, 'idExamen': examen.dataValues.id, 'respuestas':preguntasList.toString() });    
    res.json(examen);
});


//Asignar preguntas de los alumnos

router.post('/alumno/preguntas', 
//[    check('nombre', 'El nombre del Examen es obligatorio').not().isEmpty() ], 
async(req, res,)=>{
    const errors = validationResult(req);
    const respuesta = await Respuesta.create(req.body);    
    res.json(respuesta);
});

router.post('/alumno/resultado', async(req, res)=>{
    const respuesta = await ResultadoAlumno.create(req.body);
    console.log(respuesta);
    res.json(respuesta);
});

router.put('/:id', async(req, res)=>{
    await Examenes.update(req.body, {
        where:{ id: req.params.id}
    });

    res.send('Registro Actualizado');
});

router.put('/actualiza/:id/:estatus', async(req, res)=>{
    await Examenes.update({"estatus": req.params.estatus}, {
        where:{ id: req.params.id}
    });
    res.send('Registro Actualizado');
});

router.get('/lista/:id', async(req, res)=>{
    const consulta = await Examenes.findAll({
        where:{ idUsuario: req.params.id}
    });
    const newConsulta = JSON.parse(JSON.stringify(consulta));
    for(var i =0 ; i<newConsulta.length; i++){
        try {
            const respuestasE = await Respuesta.findOne({
                where:{ idAlumno: -1, idExamen:newConsulta[i].id}
            });
            console.log(respuestasE);
            newConsulta[i].respuestas=JSON.parse(JSON.stringify(respuestasE));
            
        } catch (error) {
            newConsulta[i].respuestas=[];
        }
        
    }

    console.log(newConsulta);
    res.json(newConsulta);
});

router.delete('/:id', async(req, res)=>{
    await Examenes.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});





router.get('/publico/:id', async(req, res)=>{
    console.log("ID: ",  req.params);

    const consulta = await Examenes.findOne({
        where:{ id: req.params.id, estatus:'ABIERTO'}
    });
    if(consulta!= null){
        var newConsulta = JSON.parse(JSON.stringify(consulta));
        console.log(newConsulta);
        
        const respuestasE = await Respuesta.findOne({
            where:{ idAlumno: -1, idExamen:newConsulta.id}
        });
        console.log(respuestasE);
        newConsulta.respuestas=JSON.parse(JSON.stringify(respuestasE));
        
        return res.json(newConsulta);
    }
    return res.json({"msg": "Este examen no se encuentra con el estatus abierto"});
});

router.get('/publico/lista/:idUsuario/:idEscuela', async(req, res)=>{
    const consulta = await Examenes.findAll({
        where:{ idUsuario: req.params.idUsuario, estatus:'ABIERTO'}
    });
    const newConsulta = JSON.parse(JSON.stringify(consulta));

    if(newConsulta!=null){
        for(var i =0 ; i<newConsulta.length; i++){
            const calificado = await EscuelaExamen.findOne({where:{idEscuela: req.params.idEscuela, idExamen:newConsulta[i].id } });
            console.log(calificado);
            if(calificado== null){
                newConsulta[i].calificado=false;
            }else{
                newConsulta[i].calificado=true;
            }
        }
    }

    console.log(newConsulta);
    res.json(newConsulta);
});

router.post('/publico/terminar/:idEscuela/:idExamen', async(req, res)=>{
    const {idEscuela, idExamen}= req.params;



    
    
    
    var calificado = await EscuelaExamen.findOne({where:{idEscuela, idExamen } });
    console.log(calificado);
    if(calificado == null){
        var sum = 0;
        
        const alumnos =  await Alumno.findAll({ where:{ idEscuela: idEscuela} });
        const newConsulta = JSON.parse(JSON.stringify(alumnos));
        

        var alumnosSalida=0;    
        for(var i=0; i<newConsulta.length; i++){
            const alumnosRes = await ResultadoAlumno.findOne({where:{ idAlumno: newConsulta[i].id, idExamen:idExamen }, attributes: ['id', 'resultado']});
            if(alumnosRes!= null){    
                const newConsulta2 = JSON.parse(JSON.stringify(alumnosRes));
                console.log(newConsulta2);
                newConsulta[i].resultado=newConsulta2.resultado;

                var resultados = await ResultadoAlumno.findOne({where:{idAlumno: newConsulta[i].id, idExamen } });
                console.log(resultados);
                if(resultados!= null){
                    var resAl = JSON.parse(JSON.stringify(resultados));
                    sum+=resAl.resultado;
                    alumnosSalida++;
                }
                
            }
            
        }
        
        console.log(sum," - ", alumnosSalida);
        var calificadoOK = await EscuelaExamen.create({idEscuela, idExamen, calificado:"CALIFICADO", promedio: sum!=0?sum/alumnosSalida:0.0, noAlumnos:alumnosSalida});
    }


    res.json(calificado);     
});





router.get('/publico/resultados/:idExamen/:idSupervisor', async(req, res)=>{
    //Primero se buscan las escuelas por el ID del supervidor
    const{idExamen, idSupervisor}= req.params;    
    const escuelas = await Escuela.findAll({where:{idUsuario: idSupervisor} });
    
    var escuelasTerminadas=[];
    var escuelasFinal=[];
    if(escuelas!= null){
        const escuelasList = JSON.parse(JSON.stringify(escuelas));
        
        for(var x =0; x < escuelasList.length; x++){
            var calificado = await EscuelaExamen.findOne({where:{idEscuela: escuelasList[x].id, idExamen } });
            console.log(calificado);
            if(calificado != null){
                escuelasList[x].calificado = JSON.parse(JSON.stringify(calificado));
                escuelasTerminadas.push(escuelasList[x]);
            }
        }
    }

    for(var y=0; y<escuelasTerminadas.length; y++){

        const alumnos =  await Alumno.findAll({ where:{ idEscuela: escuelasTerminadas[y].id} });
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
        escuelasTerminadas[y].alumnos=alumnosSalida;
        
    }

    
    



    res.json(escuelasTerminadas);
});




router.get('/abrir/supervisor/:idExamen/:idSupervisor', async(req, res)=>{
    //Primero se buscan las escuelas por el ID del supervidor
    const{idExamen, idSupervisor}= req.params;    
    const escuelas = await Escuela.findAll({where:{idUsuario: idSupervisor} });
    
    var escuelasTerminadas=[];
    var escuelasFinal=[];
    if(escuelas!= null){
        const escuelasList = JSON.parse(JSON.stringify(escuelas));
        
        for(var x =0; x < escuelasList.length; x++){
            var calificado = await EscuelaExamen.findOne({where:{idEscuela: escuelasList[x].id, idExamen } });
            console.log(calificado);
            if(calificado != null){
                escuelasList[x].calificado = JSON.parse(JSON.stringify(calificado));
                escuelasTerminadas.push(escuelasList[x]);
            }
        }
    }
    return res.json(escuelasTerminadas);
});



router.delete('/escuela-examen/:id', async(req, res)=>{
    await EscuelaExamen.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});
 

module.exports=router;