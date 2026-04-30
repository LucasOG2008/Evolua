const User = require('../models/User');
const db = require('../config/database');

const userController = {

    async listar(req, res) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });
        }
    },
    
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.execute(
                `SELECT u.id, u.nome, u.email, u.cargo, u.setor, u.descricao, u.Pontos,
                        p.Nome as psi_nome, p.Email as psi_email,
                        p.Telefone as psi_telefone, p.Descricao as psi_descricao
                 FROM usuarios u
                 LEFT JOIN usuario_psicologo up ON u.id = up.ID_usuario AND up.Status = 'ativo'
                 LEFT JOIN psicologo p ON up.ID_psicologo = p.ID
                 WHERE u.id = ?`,
                [id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            return res.json(rows[0]);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async atualizarDescricao(req, res) {
        try {
            const { descricao } = req.body;
            const userCpf = req.user.cpf; 

            if (!userCpf) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const sql = "UPDATE usuarios SET descricao = ? WHERE CPF = ?";
            await db.execute(sql, [descricao, userCpf]);

            return res.status(200).json({ mensagem: "Descrição atualizada com sucesso!" });
        } catch (error) {
            console.error("Erro no controller:", error);
            return res.status(500).json({ erro: "Erro interno ao salvar no banco" });
        }
    }
};

module.exports = userController;