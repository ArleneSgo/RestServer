const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//default options
// app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }
    //validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    };

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    };

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Aqui, imagen cargada
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id)
        .then((usuarioDB) => {
            if (!usuarioDB) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }
            borraArchivo(usuarioDB.img, 'usuarios');
            usuarioDB.img = nombreArchivo;
            usuarioDB.save()
                .then((usuarioGuardado) => {
                    res.json({
                        ok: true,
                        usuario: usuarioGuardado,
                        img: nombreArchivo
                    });
                });

        })
        .catch((err) => {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id)
        .then((productoDB) => {
            if (!productoDB) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }
            borraArchivo(productoDB.img, 'productos');
            productoDB.img = nombreArchivo;
            productoDB.save()
                .then((productoGuardado) => {
                    res.json({
                        ok: true,
                        producto: productoGuardado,
                        img: nombreArchivo
                    });
                });

        })
        .catch((err) => {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        })
}

function borraArchivo(nombreImagen, tipo) {
    //en caso de que el usuario tiene foto la borra y agrega la nueva
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;