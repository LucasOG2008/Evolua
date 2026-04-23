const express = require('express');
const router = express.Router();
const psicologoController = require('../controllers/psicologoController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
 

router.get('/', authMiddleware, psicologoController.listar);
router.post('/:id/curtir', authMiddleware, psicologoController.curtir);
 

router.get('/perfil', authMiddleware, psicologoController.perfil);
 

router.post('/',
    upload.single('foto'),
    psicologoController.cadastrar
);
 
module.exports = router;
 