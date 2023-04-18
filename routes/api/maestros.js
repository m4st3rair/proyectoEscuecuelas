const router = require("express").Router();
const {Maestro} = require('../../db');
const {check, validationResult} = require('express-validator');


router.get('/get-all', async (req, res)=>{
    const maestros = await Maestro.findAll();
    res.json(maestros);
});


router.post('/login', [
    check('coreo', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty()
], async(req, res,)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(422).json({errores: errors.array()})
    }


    const maestro = await Maestro.create(req.body);
    res.json(maestro);
});

router.post('/', [
    check('nombre', 'El nombre del maestro es obligatorio').not().isEmpty()
], async(req, res,)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(422).json({errores: errors.array()})
    }


    const maestro = await Maestro.create(req.body);
    res.json(maestro);
});

router.put('/:id', async(req, res)=>{
    await Maestro.update(req.body, {
        where:{ id: req.params.id}
    });

    res.send('Registro Actualizado');
});
router.get('/:id', async(req, res)=>{

    res.send("nice nice nice nice");
});

router.delete('/:id', async(req, res)=>{
    await Maestro.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});





module.exports=router;