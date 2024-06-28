const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//signIn-google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
    // res.json({
    //     ok: true
    // });
    let body = req.body;
    Usuario.findOne({ email: body.email })
        .then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña incorrectos'
                    }
                });
            }
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña incorrectos'
                    }
                });
            }
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        })
});
//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
}

app.post('/google', (req, res) => {
    let token = req.body.idtoken;
    verify(token);
    res.json({
        token
    });
});

module.exports = app;