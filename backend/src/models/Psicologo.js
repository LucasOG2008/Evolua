const db = require('../config/database');

const Psicologo = {
    async findAll() {
        const [rows] = await db.execute(
            'SELECT ID, Nome, Email, Telefone, Foto, Descricao FROM psicologo'
        );
        return rows;
    }
};

module.exports = Psicologo;