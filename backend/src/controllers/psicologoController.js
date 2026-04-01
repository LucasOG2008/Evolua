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
                Descricao: p.Descricao, // ← estava faltando
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

        console.log("idPsicologo:", idPsicologo);
        console.log("idUsuario:", idUsuario);

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
}
};

module.exports = psicologoController;