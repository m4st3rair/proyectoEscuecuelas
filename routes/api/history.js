const router = require("express").Router();
const {Historial} = require('../../db');
const {check, validationResult} = require('express-validator');


router.get('/get-all', async (req, res)=>{
    const respuesta = await Historial.findAll(); //Trae todos los datos de la teibol
    res.json(respuesta);
});

router.post('/', async(req, res,)=>{
    const respuesta = await Historial.create(req.body); // Ingresa datos / carga datos en la teibol 
    res.json(respuesta);
});

router.put('/:id', async(req, res)=>{ //Put para actualizar
    await Historial.update(req.body, {
        where:{ id_usuario: req.params.id}
    });

    res.send('Registro Actualizado');
});
router.get('/:id', async(req, res)=>{ 
    const respuesta = await Historial.findOne({where: {id_usuario: req.params.id}}); //Regresa un Perfil por ID
    res.json(respuesta);
    //res.send("nice nice nice nice"); // :3
});

router.delete('/:id', async(req, res)=>{
    await Historial.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});

module.exports=router;