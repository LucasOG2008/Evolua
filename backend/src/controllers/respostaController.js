const db = require('../config/database');

const respostaController = {

    async salvarFormulario(req, res) {
        try {
            const idUsuario = req.user.id;
            const { respostas } = req.body;

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
                'UPDATE usuarios SET Pontos = Pontos + 10 WHERE ID = ?',
                [idUsuario]
            );

            return res.status(201).json({ mensagem: 'Desafio enviado com sucesso! +10 pontos' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async listarPorPaciente(req, res) {
    try {
        const idPsicologo = req.user.id;
        const idPaciente = req.params.id;

        const { tipo } = req.query; 

        if (tipo === 'desafio') {
            const [vinculo] = await db.execute(
                `SELECT ID FROM usuario_psicologo
                 WHERE ID_psicologo = ? AND ID_usuario = ? AND Status IN ('pendente', 'ativo')`,
                [idPsicologo, idPaciente]
            );

            if (vinculo.length === 0) {
                return res.status(403).json({ erro: 'Este paciente não está vinculado ao seu perfil.' });
            }
        }

        const [respostas] = await db.execute(
            `SELECT
                r.ID,
                r.ID_pergunta,
                r.Resposta,
                r.Status,
                r.Data_resposta,
                r.Tipo,
                r.Observacao_psicologo,
                p.Pergunta
             FROM resposta r
             LEFT JOIN perguntas p ON r.ID_pergunta = p.ID
             WHERE r.ID_usuario = ? ${tipo ? 'AND r.Tipo = ?' : ''}
             ORDER BY r.Tipo, r.Data_resposta DESC`,
            tipo ? [idPaciente, tipo] : [idPaciente]
        );

        return res.json(respostas);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
},

    async validar(req, res) {
        try {
            const idPsicologo = req.user.id;
            const idResposta  = req.params.id;
            const { status, observacao } = req.body;

            if (!['analisado', 'invalido'].includes(status)) {
                return res.status(400).json({ erro: "Status deve ser 'analisado' ou 'invalido'" });
            }

            // Verifica se a resposta existe e pega o Tipo
            const [respostaInfo] = await db.execute(
                'SELECT ID, Tipo FROM resposta WHERE ID = ?',
                [idResposta]
            );

            if (respostaInfo.length === 0) {
                return res.status(404).json({ erro: 'Resposta não encontrada.' });
            }

            if (respostaInfo[0].Tipo === 'desafio') {
                const [check] = await db.execute(
                    `SELECT up.ID FROM resposta r
                    INNER JOIN usuario_psicologo up ON r.ID_usuario = up.ID_usuario
                    WHERE r.ID = ? AND up.ID_psicologo = ? AND up.Status IN ('pendente', 'ativo')`,
                    [idResposta, idPsicologo]
                );
                if (check.length === 0) {
                    return res.status(403).json({ erro: 'Sem permissão para esta resposta.' });
                }
            }

            await db.execute(
                'UPDATE resposta SET Status = ?, Observacao_psicologo = ? WHERE ID = ?',
                [status, observacao || null, idResposta]
            );

            return res.json({ mensagem: `Resposta marcada como ${status} com sucesso.` });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};

module.exports = respostaController;