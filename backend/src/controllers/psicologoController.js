const Psicologo = require('../models/Psicologo');
const db = require('../config/database');

const psicologoController = {

    async listar(req, res) {
        try {
            const idUsuario = req.user.id;

            const [rows] = await db.execute(
                `SELECT p.ID, p.Nome, p.Email, p.Telefone, p.Descricao, p.Foto
                FROM psicologo p
                INNER JOIN usuario_psicologo up
                ON p.ID = up.ID_psicologo
                WHERE up.ID_usuario = ?
                AND up.Status = 'pendente'`,
                [idUsuario]
            );

            const resultado = rows.map(p => ({
                ID: p.ID,
                Nome: p.Nome,
                Email: p.Email,
                Telefone: p.Telefone,
                Descricao: p.Descricao,
                Foto: p.Foto ? `data:image/jpeg;base64,${Buffer.from(p.Foto).toString('base64')}` : null
            }));

            return res.json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },
    async perfil(req, res) {
        try {
            const idPsicologo = req.user.id;

            const [rows] = await db.execute(
                'SELECT ID, Nome, Email, Telefone, CRP, Descricao FROM psicologo WHERE ID = ?',
                [idPsicologo]
            );

            if (rows.length === 0) {
                return res.status(404).json({ erro: 'Psicólogo não encontrado' });
            }

            return res.json(rows[0]);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async curtir(req, res) {
        try {
            const idPsicologo = req.params.id;
            const idUsuario = req.user.id;

            if (!idPsicologo || !idUsuario) {
                return res.status(400).json({ erro: 'Dados inválidos' });
            }

            const [pendente] = await db.execute(
                `SELECT ID FROM usuario_psicologo
                WHERE ID_psicologo = ? AND ID_usuario = ? AND Status = 'pendente'`,
                [idPsicologo, idUsuario]
            );

            await db.execute(
                `UPDATE usuario_psicologo
                SET Status = 'ativo', Data_inicio = CURDATE()
                WHERE ID_psicologo = ? AND ID_usuario = ?`,
                [idPsicologo, idUsuario]
            );

            await db.execute(
                `DELETE FROM usuario_psicologo
                WHERE ID_usuario = ? AND ID_psicologo != ? AND Status = 'pendente'`,
                [idUsuario, idPsicologo]
            );

            return res.status(200).json({ mensagem: 'Psicólogo aceito com sucesso! Vínculo ativo.' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async listarPacientes(req, res) {
        try {
            const idPsicologo = req.user.id;

            const [rows] = await db.execute(
                `SELECT u.ID, u.nome AS Nome, u.email AS Email, u.cargo AS Cargo, u.setor AS Setor, u.descricao AS Descricao
                 FROM usuarios u
                 WHERE u.tipo = 'comum'
                   AND u.ID NOT IN (
                       SELECT ID_usuario FROM usuario_psicologo WHERE Status = 'ativo'
                   )
                   AND u.ID NOT IN (
                       SELECT ID_usuario FROM usuario_psicologo
                       WHERE ID_psicologo = ? AND Status = 'pendente'
                   )`,
                [idPsicologo]
            );

            return res.json(rows);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async curtirPaciente(req, res) {
        try {
            const idPaciente = req.params.id;
            const idPsicologo = req.user.id;

            if (!idPaciente || !idPsicologo) {
                return res.status(400).json({ erro: 'Dados inválidos' });
            }

            const [jaExiste] = await db.execute(
                `SELECT ID, Status FROM usuario_psicologo
                WHERE ID_psicologo = ? AND ID_usuario = ?`,
                [idPsicologo, idPaciente]
            );

            if (jaExiste.length > 0) {
                return res.status(409).json({ erro: `Você já demonstrou interesse neste paciente (status: ${jaExiste[0].Status})` });
            }

            await db.execute(
                `INSERT INTO usuario_psicologo (ID_psicologo, ID_usuario, Status, Data_inicio)
                VALUES (?, ?, 'pendente', CURDATE())`,
                [idPsicologo, idPaciente]
            );

            return res.status(201).json({ mensagem: 'Interesse registrado! Aguardando aceitação do paciente.' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async atualizarDescricao(req, res) {
        try {
            const { descricao } = req.body;
            const idPsicologo = req.user.id;

            if (!idPsicologo) {
                return res.status(401).json({ erro: "Psicólogo não autenticado" });
            }

            const sql = "UPDATE psicologo SET Descricao = ? WHERE ID = ?";
            await db.execute(sql, [descricao, idPsicologo]);

            return res.status(200).json({ mensagem: "Descrição atualizada com sucesso!" });
        } catch (error) {
            console.error("Erro no controller:", error);
            return res.status(500).json({ erro: "Erro interno ao salvar no banco" });
        }
    },

    async cadastrar(req, res) {
        try {
            const { nome, cpf, crp, senha, telefone, email } = req.body;

            if (!nome || !cpf || !crp || !senha || !telefone || !email) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
            }

            let fotoBuffer = null;
            if (req.file) {
                fotoBuffer = req.file.buffer;
            }

            const resultado = await Psicologo.create({
                nome, cpf, crp, senha, telefone, email, foto: fotoBuffer
            });

            return res.status(201).json({
                mensagem: 'Psicólogo cadastrado com sucesso',
                id: resultado.insertId
            });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ erro: 'CPF, CRP ou Email já cadastrado' });
            }
            return res.status(500).json({ erro: 'Erro interno no servidor' });
        }
    }
};

module.exports = psicologoController;