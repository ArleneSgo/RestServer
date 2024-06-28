const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    //res.json('get Usuario');
    // Usuario.find({})
    //     .exec((err, usuarios) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         Usuario.count({}, (err, conteo) => {
    // res.json({
    //     ok: true,
    //     usuarios,
    //     cuantos: conteo
    // })
    //})
    //     })
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec()
        .then(usuarios => {
            Usuario.count({ estado: true })
                .then(conteo => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
        })
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            });
        })
});
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    // usuario.save((err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB
    //     })
    // });
    usuario.save()
        .then((usuarioDB) => {
            //usuarioDB.password = null;
            res.status(201).json({
                ok: true,
                usuario: usuarioDB
            })
        })
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            });
        })

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });

    // }
});
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // Usuario.findByIdAndUpdate(id, body, (err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB
    //     })
    // });
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }) //el new:true es para que nos envie el usuario ya con cambios
        .then(usuarioDB => {
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        })
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            });
        })
})
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    //res.json('delete Usuario');
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
    //Usuario.findByIdAndRemove(id)
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true })
        .then(usuarioBorrado => {
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        })
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            });
        })
});

module.exports = app;