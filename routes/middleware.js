const jwt = require('jwt-simple');
const moment = require('moment');


const checkToken = (req, res, next) =>{
    if( !req.headers['user-token'] ){
        return res.status(403).json({error: "No existe el token"});
    }
    const userToken = req.headers['user-token'];
    let payload = {};
    try{
        payload = jwt.decode(userToken, 'maestros-admin')
        if(payload.expiredAt < moment().unix() ){
            return res.status(403).json({error: "El token ha expirado"});
        }
    }catch(err){
        return res.status(403).json({error: "El token es incorrecto"});
    }
    next();

}

module.exports={
    checkToken
}