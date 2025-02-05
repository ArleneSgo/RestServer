const jwt = require('jsonwebtoken');
//========================
// Verficar token
//========================
let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Authorization
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
    // res.json({
    //     token: token
    // });
};
//========================
// Verficar AdminRole
//========================
let verificaAdmin_Role = (req, res, next) => {
        let usuario = req.usuario;
        if (usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            res.json({
                ok: false,
                err: {
                    message: 'El usuario no es administrador'
                }
            });
        }
    }
    //========================
    // Verficar token para imagen
    //========================
let verificaToken_Img = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaToken_Img
}