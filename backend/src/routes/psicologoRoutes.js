const express = require('express');
const router = express.Router();
const psicologoController = require('../controllers/psicologoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, psicologoController.listar);
router.post('/:id/curtir', authMiddleware, psicologoController.curtir);

module.exports = router;