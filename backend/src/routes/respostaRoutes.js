const express = require('express');
const router = express.Router();
const respostaController = require('../controllers/respostaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/formulario', authMiddleware, respostaController.salvarFormulario);
router.post('/desafio', authMiddleware, respostaController.salvarDesafio);

module.exports = router;