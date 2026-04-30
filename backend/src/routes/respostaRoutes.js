const express = require('express');
const router = express.Router();
const respostaController = require('../controllers/respostaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/formulario', authMiddleware, roleMiddleware('comum'), respostaController.salvarFormulario);
router.post('/desafio', authMiddleware, roleMiddleware('comum'), respostaController.salvarDesafio);
router.get('/paciente/:id', authMiddleware, roleMiddleware('psicologo'), respostaController.listarPorPaciente);
router.patch('/:id/validar', authMiddleware, roleMiddleware('psicologo'), respostaController.validar);

module.exports = router;