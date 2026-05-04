const db = require('../config/database');

const User = {
    async findByCpf(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, '');
       const sql = `
            SELECT 
                u.id, 
                u.nome, 
                u.email, 
                u.cargo, 
                u.setor, 
                u.descricao, 
                u.Pontos,
                p.Nome as psi_nome, 
                p.Email as psi_email, 
                p.Telefone as psi_telefone,
                p.Descricao as psi_descricao,
                p.Foto as psi_foto
            FROM usuarios u
            LEFT JOIN usuario_psicologo up ON u.id = up.ID_usuario AND up.Status = 'ativo'
            LEFT JOIN psicologo p ON up.ID_psicologo = p.ID
            WHERE REPLACE(REPLACE(u.cpf, '.', ''), '-', '') = ?
        `;
        const [rows] = await db.execute(sql, [cpfLimpo]);
        return rows[0];
    },

    async findFullProfileByCpf(cpf) {
        return User.findByCpf(cpf);
    },

    async findAll() {
        const [rows] = await db.execute(
            'SELECT id, nome, email, cargo, setor, Pontos FROM usuarios'
        );
        return rows;
    },

    async create(user) {
        const { nome, cpf, email, senha, cargo, setor,  } = user;
        const cpfParaSalvar = cpf.replace(/\D/g, '');
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, cpf, email, senha, cargo, setor) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, cpfParaSalvar, email, senha, cargo, setor]
        );
        return result;
    }
};

module.exports = User;

