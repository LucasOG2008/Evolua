const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Desafio do dia — rotaciona diariamente entre todos os desafios cadastrados
router.get('/diario', authMiddleware, roleMiddleware('comum', 'psicologo', 'admin'), desafioController.listarDiario);

// Lista todos os desafios (uso admin/psicologo)
router.get('/', authMiddleware, roleMiddleware('comum', 'psicologo', 'admin'), desafioController.listar);

router.get('/formulario', authMiddleware, roleMiddleware('comum', 'psicologo', 'admin'), desafioController.listarFormulario);

router.post('/', authMiddleware, roleMiddleware('admin'), desafioController.criar);

module.exports = router;
