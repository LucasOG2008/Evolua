const db = require('../config/database');

const Desafio = {

    async findAll() {
        const [rows] = await db.execute(
            "SELECT * FROM perguntas WHERE ID > 5 ORDER BY ID"
        );
        return rows;
    },

    async findDiario() {
        const [rows] = await db.execute(
            "SELECT * FROM perguntas WHERE ID > 5 ORDER BY ID"
        );

        if (rows.length === 0) return null;

        const EPOCH_REF = new Date('2026-05-05T00:00:00Z').getTime();
        const hoje = new Date();
        const dataHoje = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const diasPassados = Math.floor((dataHoje - EPOCH_REF) / (1000 * 60 * 60 * 24));
        const indice = ((diasPassados % rows.length) + rows.length) % rows.length;

        return rows[indice];
    },

    async findFormulario() {
        const [rows] = await db.execute(
            "SELECT * FROM perguntas WHERE ID <= 5 ORDER BY ID"
        );
        return rows;
    },

    async create(desafio) {
        const { titulo, descricao } = desafio;
        const [result] = await db.execute(
            "INSERT INTO perguntas (Pergunta) VALUES (?)",
            [titulo || descricao]
        );
        return result;
    }
};

module.exports = Desafio;