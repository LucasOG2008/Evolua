const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const User = require('../models/User');

router.get('/', authMiddleware, roleMiddleware('admin'), userController.listar);

router.get('/admin/todos', authMiddleware, roleMiddleware('admin'), userController.listar);

router.get('/admin/:id', authMiddleware, roleMiddleware('admin'), userController.buscarPorId);

router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await User.findFullProfileByCpf(req.user.cpf);

        if (!user) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json({
            id: user.id,
            nome: user.nome,
            cargo: user.cargo,
            setor: user.setor,
            descricao: user.descricao,
            Pontos: user.Pontos,
            psi_nome: user.psi_nome,
            psi_email: user.psi_email,
            psi_telefone: user.psi_telefone,
            psi_descricao: user.psi_descricao,
            psi_foto: user.psi_foto ? `data:image/jpeg;base64,${Buffer.from(user.psi_foto).toString('base64')}` : null
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.patch('/perfil/descricao', authMiddleware, roleMiddleware('comum', 'psicologo'), userController.atualizarDescricao);

module.exports = router;
