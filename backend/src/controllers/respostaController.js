const db = require('../config/database');

const respostaController = {

    async salvarFormulario(req, res) {
        try {
            const idUsuario = req.user.id;
            const { respostas } = req.body;
            // respostas = [{ id_pergunta: 1, resposta: "texto" }, ...]

            for (const item of respostas) {
                await db.execute(
                    `INSERT INTO resposta (ID_usuario, ID_pergunta, Resposta, Status, Data_resposta, Tipo)
                     VALUES (?, ?, ?, 'enviado', NOW(), 'formulario')`,
                    [idUsuario, item.id_pergunta, item.resposta]
                );
            }

            return res.status(201).json({ mensagem: 'Formulário enviado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async salvarDesafio(req, res) {
        try {
            const idUsuario = req.user.id;
            const { id_pergunta, resposta } = req.body;

            await db.execute(
                `INSERT INTO resposta (ID_usuario, ID_pergunta, Resposta, Status, Data_resposta, Tipo)
                 VALUES (?, ?, ?, 'enviado', NOW(), 'desafio')`,
                [idUsuario, id_pergunta, resposta]
            );

            await db.execute(
                'UPDATE usuarios SET Pontos = Pontos + 10 WHERE id = ?',
                [idUsuario]
            );

            return res.status(201).json({ mensagem: 'Desafio enviado com sucesso! +10 pontos' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};

module.exports = respostaController;