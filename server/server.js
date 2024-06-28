require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de rutas
app.use(require('./routes/index/index'));

//Coexión BD
// mongoose.connect('mongodb://127.0.0.1/cafe',{useNewUrlParser:true, useCreateIndex:true} (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos ONLINE');
// });
// mongoose.connect("mongodb://127.0.0.1/cafe")
//     .then(() => console.log('Base de datos ONLINE'))
//     .catch((err) => { throw err });
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(() => console.log('Base de datos ONLINE'))
    .catch((err) => { throw err });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});