const db = require('../config/database');

const Desafio = {

    // Desafios = perguntas com ID > 5
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM perguntas WHERE ID > 5');
        return rows;
    },

    // Formulário = perguntas com ID entre 1 e 5
    async findFormulario() {
        const [rows] = await db.execute('SELECT * FROM perguntas WHERE ID <= 5 ORDER BY ID');
        return rows;
    },

    async create(desafio) {
        const { titulo, descricao } = desafio;
        const [result] = await db.execute(
            'INSERT INTO perguntas (Pergunta) VALUES (?)',
            [titulo || descricao]
        );
        return result;
    }
};

module.exports = Desafio;