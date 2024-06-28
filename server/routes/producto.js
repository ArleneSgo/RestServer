const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const producto = require('../models/producto');

//Obtener productos
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec()
        .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });

        })
});
//Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .then(productoDB => {
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //crear expresion regular para buscar 
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .then(productos => {
            res.json({
                ok: true,
                productos
            })
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Crear un producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save()
        .then((productoDB) => {
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id)
        .then((productoDB) => {
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;
            productoDB.save()
                .then((productoGuardado) => {

                    res.json({
                        ok: true,
                        producto: productoGuardado
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                })
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//Eliminar producto---modificar disponible
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .then((productoDB) => {
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }
            productoDB.disponible = false;
            productoDB.save()
                .then((productoBorrado) => {
                    res.json({
                        ok: true,
                        producto: productoBorrado,
                        message: 'Producto borrado'
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                })
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
module.exports = app;