const db = require('../config/database');

const User = {

    async findByCpf(cpf) {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE cpf = ?',
            [cpf]
        );
        return rows[0];
    },

    async findAll() {
        const [rows] = await db.execute(
            'SELECT id, nome, email, cargo, setor FROM usuarios'
        );
        return rows;
    },

    async create(user) {
        const { nome, cpf, email, senha, cargo, setor } = user;

        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, cpf, email, senha, cargo, setor) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, cpf, email, senha, cargo, setor]
        );

        return result;
    }
};

module.exports = User;