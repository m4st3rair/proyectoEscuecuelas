const router = require("express").Router();
const {Perfildoc} = require('../../db');


router.get('/get-all', async (req, res)=>{
    const respuesta = await Perfildoc.findAll(); //Trae todos los datos de la teibol
    res.json(respuesta);
});

router.post('/', async(req, res,)=>{
    const respuesta = await Perfildoc.create(req.body); // Ingresa datos / carga datos en la teibol 
    res.json(respuesta);
});

router.put('/:id', async(req, res)=>{ //Put para actualizar
    await Perfildoc.update(req.body, {
        where:{ id_usuario: req.params.id}
    });

    res.send('Registro Actualizado');
});
router.get('/:id', async(req, res)=>{ 
    const respuesta = await Perfildoc.findOne({where: {id_usuario: req.params.id}}); //Regresa un Perfil por ID
    res.json(respuesta);
    //res.send("nice nice nice nice"); // :3
});

router.delete('/:id', async(req, res)=>{
    await Perfildoc.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});

module.exports=router;