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