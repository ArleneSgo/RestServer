//========================
// Puerto
//========================
process.env.PORT = process.env.PORT || 3000;
//========================
// Entorno
//========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================
// Vencimiento del token
//========================
//60 seg 60 min 24hr 30 días
//process.env.CADUCIDAD_TOKEN = 60*60*24*30
process.env.CADUCIDAD_TOKEN = '48h';
//========================
// SEED de autenticacion
//========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//========================
// Base de datos
//========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1/cafe';
    // urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://digap52242:gvRSQ51YWtzsKObe@cluster0.xnonmuq.mongodb.net/';
}
process.env.URLDB = urlDB;

//========================
// Google Client ID
//========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '177392519235-of21m644co41ji3u3l73sge4pddc4nf0.apps.googleusercontent.com';