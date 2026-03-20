const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');

router.get('/', desafioController.listar);
router.post('/', desafioController.criar);

module.exports = router;