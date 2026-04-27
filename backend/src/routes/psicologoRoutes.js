const express = require('express');
const router = express.Router();
const psicologoController = require('../controllers/psicologoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

router.get('/',
    authMiddleware,
    roleMiddleware('comum', 'admin'),
    psicologoController.listar
);

router.post('/:id/curtir',
    authMiddleware,
    roleMiddleware('comum'),
    psicologoController.curtir
);

router.get('/perfil',
    authMiddleware,
    psicologoController.perfil
);

router.get('/pacientes',
    authMiddleware,
    roleMiddleware('psicologo'),
    psicologoController.listarPacientes
);

router.post('/pacientes/:id/curtir',
    authMiddleware,
    roleMiddleware('psicologo'),
    psicologoController.curtirPaciente
);

router.post('/',
    authMiddleware,
    roleMiddleware('admin'),
    upload.single('foto'),
    psicologoController.cadastrar
);

module.exports = router;
