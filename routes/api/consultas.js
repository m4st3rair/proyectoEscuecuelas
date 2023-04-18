const router = require("express").Router();
const {Consulta} = require('../../db');
const {Perfildoc} = require('../../db');
const {Historial} = require('../../db');




router.get('/usuario/:id', async(req, res)=>{
    const consulta = await Consulta.findAll({
        where:{ id_usuario: req.params.id}
    });
    const newConsulta = JSON.parse(JSON.stringify(consulta));
    for(var i =0; i < newConsulta.length; i++){
        console.log(newConsulta[i]);
        const doc = await Perfildoc.findOne({
            where:{ id_usuario: newConsulta[i].id_medico}
        });
        const newDoc = JSON.parse(JSON.stringify(doc));
        console.log(newDoc);
        newConsulta[i].doctor=newDoc;
    }
    res.json(newConsulta);
});

router.get('/medico/:id/:status', async(req, res)=>{
    const consulta = await Consulta.findAll({
        where:{ id_medico: req.params.id, status: req.params.status}
    });

    const newConsulta = JSON.parse(JSON.stringify(consulta));
    for(var i =0; i < newConsulta.length; i++){
        console.log(newConsulta[i]);
        const doc = await Historial.findOne({
            where:{ id_usuario: newConsulta[i].id_usuario}
        });
        const newDoc = JSON.parse(JSON.stringify(doc));
        console.log(newDoc);
        newConsulta[i].historial=newDoc;
    }
    res.json(newConsulta);
});


router.get('/get-all', async (req, res)=>{
    const consulta = await Consulta.findAll();
    res.json(consulta);
});

router.post('/get-fecha', async (req, res)=>{
    const consulta = await Consulta.findAll({
        where:{ fecha_consulta: req.body.fecha_consulta }
    });
    const newConsulta = JSON.parse(JSON.stringify(consulta));
    for(var i =0; i < newConsulta.length; i++){
        console.log(newConsulta[i]);
        const doc = await Historial.findOne({
            where:{ id_usuario: newConsulta[i].id_usuario}
        });
        const newDoc = JSON.parse(JSON.stringify(doc));
        console.log(newDoc);
        newConsulta[i].historial=newDoc;
    }
    res.json(newConsulta);
});



router.get('/', async (req, res)=>{
    
    res.send('Consultas');
});





router.post('/', async(req, res,)=>{
    console.log(req.body);
    try {
        const consulta = await Consulta.create(req.body);
        res.json(consulta);
        
    } catch (error) {
        console.log(error);
        res.send("Esta mal weon");
    }
});


router.put('/:id', async(req, res)=>{
    await Consulta.update(req.body, {
        where:{ id: req.params.id}
    });

    res.send('Registro Actualizado');
});

router.get('/:id', async(req, res)=>{
    const consulta = await Consulta.findOne({
        where:{ id: req.params.id}
    });
    res.json(consulta);
});


router.delete('/:id', async(req, res)=>{
    await Consulta.destroy({
        where:{ id: req.params.id}
    });

    res.send("Registro eliminado");
});

module.exports=router;

