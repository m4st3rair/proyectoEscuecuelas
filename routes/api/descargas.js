const router = require("express").Router();
const {Escuela, EscuelaExamen, Alumno, Respuesta, ResultadoAlumno, Examenes} = require('../../db');
const {check, validationResult} = require('express-validator');
const excelJS = require("exceljs");


const users = [
    { 
     fname: "Amir", 
     lname: "Mustafa", 
     email: "amir@gmail.com", 
     gender: "Male" 
    },
    {
     fname: "Ashwani",
     lname: "Kumar",
     email: "ashwani@gmail.com",
     gender: "Male",
    },
    { 
     fname: "Nupur", 
     lname: "Shah", 
     email: "nupur@gmail.com", 
     gender: "Female" 
    },
    {
     fname: "Himanshu",
     lname: "Mewari",
     email: "himanshu@gmail.com",
     gender: "Male",
    },
    {
    fname: "Vankayala",
    lname: "Sirisha",
    email: "sirisha@gmail.com",
    gender: "Female",
    },
    ];




router.get('/', async (req, res)=>{
    res.send("DESCARGAS");
});

router.get('/excel/zona/:idSupervisor/:idExamen', async (req, res)=>{
    const {idSupervisor, idExamen} = req.params;
    const listaEscuelas = await getConcentradoEscuelas(idExamen, idSupervisor)
    const examenData = await getExamen(idExamen);
    console.log(listaEscuelas);
    console.log(examenData);


    
    const workbook = new excelJS.Workbook();  // Create a new workbook
    
    const worksheet = workbook.addWorksheet("Datos Escuelas"); // New Worksheet
    
    // Column for data in excel. key must match data key
    worksheet.columns = [
        { header: "#", key: "s_no", width: 10 }, 
        { header: "Nombre", key: "nombre", width: 10 },
        { header: "Clave", key: "clave", width: 10 },
        { header: "Turno", key: "turno", width: 10 },
        { header: "Numero de Alumnos", key: "noAlumnos", width: 10 },
        { header: "Promedio", key: "promedio", width: 10 },
    ];
    // Looping through User data
    let counter = 1;
    listaEscuelas.forEach((user) => {
        user.s_no = counter;
        user.promedio= user.calificado.promedio;
        user.noAlumnos= user.calificado.noAlumnos;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
    });

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });


/////HASTA AQUI LLEGARIA SI NO SE TUBIERA QUE HACER NADA MAS QUE SOLO UNA HOJA//////
    var concentradoAlumnos=[];

    for(var j =0; j<listaEscuelas.length; j++){
        const worksheet2 = workbook.addWorksheet(listaEscuelas[j].nombre); 
        worksheet2.columns = await getHeadersExamen(examenData);  
        
        var alumnosList= await getAlumnosEscuela(listaEscuelas[j]);
        
        console.log(alumnosList);
        // Looping through User data
        counter = 1;
        
        alumnosList.forEach((user) => {
            concentradoAlumnos.push(user);
            user.s_no = counter;
            worksheet2.addRow(user); // Add data in worksheet2
            counter++;
        });
        
        // Making first line in excel bold
        worksheet2.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        

    }


    //y ahora el concentrado de los alumnos

    const worksheet3 = workbook.addWorksheet("Concentrado De Alumnos"); 
    worksheet3.columns = await getHeadersExamen(examenData);  
    
    console.log(concentradoAlumnos);
    // Looping through User data
    counter = 1;
    concentradoAlumnos.forEach((user) => {

        user.s_no = counter;
        worksheet3.addRow(user); // Add data in worksheet3
        counter++;
    });

    // Making first line in excel bold
    worksheet3.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });




    try {
        var fileName = 'Escuela_.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        await workbook.xlsx.write(res);
    } catch (err) {
        console.log(err);
    }
    res.end();
    
});

async function getHeadersExamen (examenAux){
    var headers=[
        { header: "#", key: "s_no", width: 10 }, 
        { header: "Clave De la institucion", key: "clave", width: 10 },
        { header: "Nombre", key: "nombre", width: 10 },
        { header: "Apellido Paterno", key: "apellidoPaterno", width: 10 },
        { header: "Apellido Materno", key: "apellidoMaterno", width: 10 },
        { header: "Resultado", key: "resultado", width: 10 },

    ];
    for(var i = 0; i< examenAux.noPreguntas; i++){
        headers.push({header:`No ${i+1}`, key:`no${i+1}`, width: 10})
    }

    return headers;
}

async function getAlumnosEscuela(escuelaAux){
    var listaAlumnos=[];
    const alu= escuelaAux.alumnos;

    for(var x =0 ; x < alu.length; x++){
        console.log(alu[x]);
        var aluAux ={
            clave:escuelaAux.clave, 
            nombre: alu[x].nombre,  
            apellidoPaterno: alu[x].apellidoPaterno,
            apellidoMaterno: alu[x].apellidoMaterno,
            resultado: alu[x].resultado,
        };
        var rN =alu[x].respuestas.respuestas.split(",");
        for(var y =0; y<rN.length; y++){
            aluAux[`no${y+1}`]=rN[y];
        }
        listaAlumnos.push(aluAux);
    }


    return listaAlumnos;
}



async function getConcentradoEscuelas(idExamen, idSupervisor){

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

    
    



   return escuelasTerminadas;
}



async function getExamen(idExamen){
    
    const consulta = await Examenes.findOne({
        where:{ id: idExamen}
    });

    if(consulta!= null){
        var newConsulta = JSON.parse(JSON.stringify(consulta));
        console.log(newConsulta);
        
        const respuestasE = await Respuesta.findOne({
            where:{ idAlumno: -1, idExamen:newConsulta.id}
        });
        console.log(respuestasE);
        newConsulta.respuestas=JSON.parse(JSON.stringify(respuestasE));
        
        return newConsulta;
    }


}




//router.post('/', async(req, res,)=>{
//    const respuesta = await Historial.create(req.body); // Ingresa datos / carga datos en la teibol 
//    res.json(respuesta);
//});
//
//router.put('/:id', async(req, res)=>{ //Put para actualizar
//    await Historial.update(req.body, {
//        where:{ id_usuario: req.params.id}
//    });
//
//    res.send('Registro Actualizado');
//});
//router.get('/:id', async(req, res)=>{ 
//    const respuesta = await Historial.findOne({where: {id_usuario: req.params.id}}); //Regresa un Perfil por ID
//    res.json(respuesta);
//    //res.send("nice nice nice nice"); // :3
//});
//
//router.delete('/:id', async(req, res)=>{
//    await Historial.destroy({
//        where:{ id: req.params.id}
//    });
//
//    res.send("Registro eliminado");
//});

module.exports=router;