const db = require('../config/database');
const bcrypt = require('bcrypt');

const Psicologo = {
    async findAll() {
        const [rows] = await db.execute(
            'SELECT ID, Nome, Email, Telefone, Foto, Descricao FROM psicologo'
        );
        return rows;
    },

    async create({ nome, cpf, crp, senha, telefone, email, foto }) {
        const senhaHash = await bcrypt.hash(senha, 10);
        const cpfLimpo = cpf.replace(/\D/g, '');

        const sql = `
            INSERT INTO psicologo (Nome, CPF, CRP, Senha, Telefone, Email, Foto, Descricao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            nome,
            cpfLimpo,
            crp,
            senhaHash,
            telefone,
            email,
            foto || null,
            null
        ]);
        return result;
    }
};

module.exports = Psicologo;