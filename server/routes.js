// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();


const mensajesDB = [
  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola mundo!'
  },
  {
    _id: 'XXX',
    user: 'iroman',
    mensaje: 'Hola mundo!'
  },
  {
    _id: 'XXX',
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


module.exports = router;