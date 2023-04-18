const router = require("express").Router();
const {Escuela} = require('../../db');
const {check, validationResult} = require('express-validator');


router.get('/get-all', async (req, res)=>{
    const alumnos = await Escuela.findAll();
    res.json(alumnos);
});

router.post('/', [
    check('nombre', 'El nombre del alumno es obligatorio').not().isEmpty()
], async(req, res,)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(422).json({errores: errors.array()})
    }


    const alumno = await Escuela.create(req.body);
    res.json(alumno);
});

router.post('/s', async(req, res,)=>{
    const escuelas= req.body;
    for(var x =0; x<escuelas.length; x++){
        await Escuela.create(escuelas[x]);
    }
    res.json({"msg": "OK"});
});

router.put('/:id', async(req, res)=>{
    await Escuela.update(req.body, {
        where:{ id: req.params.id}
    });

    res.send('Registro Actualizado');
});
router.get('/:id', async(req, res)=>{
    const respuesta = await Escuela.findOne({where: {id: req.params.id}}); //Regresa un Perfil por ID
    res.json(respuesta);
});

router.delete('/:id', async(req, res)=>{
    await Escuela.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});



module.exports=router;