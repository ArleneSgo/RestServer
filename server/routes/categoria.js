const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

let Categoria = require('../models/categoria');
//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec()
        .then(categorias => {
            res.json({
                ok: true,
                categorias
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });

        })
});
//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .then(categoriaDB => {
            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save()
        .then((categoriaDB) => {
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                categoria: categoriaDB
            });
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true })
        .then((categoriaDB) => {
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Eliminar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id)
        .then(categoriaDB => {
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                message: 'Categoria borrada'
            });
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});

module.exports = app;