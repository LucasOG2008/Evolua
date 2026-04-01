const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, desafioController.listar);
router.get('/formulario', authMiddleware, desafioController.listarFormulario);
router.post('/', authMiddleware, desafioController.criar);

module.exports = router;