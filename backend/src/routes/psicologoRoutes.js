const express = require('express');
const router = express.Router();
const psicologoController = require('../controllers/psicologoController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Rotas existentes
router.get('/', authMiddleware, psicologoController.listar);
router.post('/:id/curtir', authMiddleware, psicologoController.curtir);

// NOVA ROTA para cadastro
router.post('/',
    //authMiddleware,
    upload.single('foto'),   // campo 'foto' do FormData
    psicologoController.cadastrar
);

module.exports = router;