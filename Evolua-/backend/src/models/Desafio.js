const db = require('../config/database');

const Desafio = {

    async findAll() {
        const [rows] = await db.execute('SELECT * FROM desafios');
        return rows;
    },

    async create(desafio) {
        const { titulo, descricao } = desafio;

        const [result] = await db.execute(
            'INSERT INTO desafios (titulo, descricao) VALUES (?, ?)',
            [titulo, descricao]
        );

        return result;
    }
};

module.exports = Desafio;