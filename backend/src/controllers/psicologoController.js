const Psicologo = require('../models/Psicologo');
const db = require('../config/database');

const psicologoController = {

    async listar(req, res) {
        try {
            const psicologos = await Psicologo.findAll();

            const resultado = psicologos.map(p => ({
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

    async curtir(req, res) {
        try {
            const idPsicologo = req.params.id;
            const idUsuario = req.user.id;

            if (!idPsicologo || !idUsuario) {
                return res.status(400).json({ erro: "Dados inválidos" });
            }

            await db.execute(
                'DELETE FROM usuario_psicologo WHERE ID_usuario = ?',
                [idUsuario]
            );

            await db.execute(
                `INSERT INTO usuario_psicologo (ID_psicologo, ID_usuario, Status, Data_inicio, Data_fim)
                 VALUES (?, ?, 'ativo', NOW(), NULL)`,
                [idPsicologo, idUsuario]
            );

            return res.status(201).json({ mensagem: 'Psicólogo vinculado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async cadastrar(req, res) {
        try {
            // REMOVIDA a verificação de admin

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