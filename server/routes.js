// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');


const mensajesDB = [
  {
    _id: '001',
    user: 'spiderman',
    mensaje: 'Hola mundo!'
  },
  {
    _id: '002',
    user: 'ironman',
    mensaje: 'Hola mundo!'
  },
  {
    _id: '003',
    user: 'hulk',
    mensaje: 'Hola mundo!'
  }
];

// Get mensajes
router.get('/', function (req, res) {
  res.json(mensajesDB);
});

// Post mensajes
router.post('/', function (req, res) {
  const msj = {
    mensaje: req.body.mensaje,
    user: req.body.user
  }

  mensajesDB.push(msj);

  res.json({
    ok: true,
    mensajes: mensajesDB
  });
});

router.get('/key', (req, res) => {
  const key = push.getKey()

  res.send(key);
});

// almacenar la subscripcion
router.post('/subscribe', (req, res) => {

  res.json('subscribe');
});

router.post('/push', (req, res) => {

  res.json('Enviar una notificacion a todos las personas');
});


module.exports = router;