const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = {
    async login(cpf, senha) {
        const cpfLimpo = String(cpf).replace(/\D/g, ''); 

        const sql = `SELECT * FROM usuarios WHERE REPLACE(REPLACE(CPF, '.', ''), '-', '') = ?`;
        const [rows] = await db.execute(sql, [cpfLimpo]);

        if (rows.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error("Senha inválida");
        }

        const token = jwt.sign(
            { 
                id: usuario.ID,
                cpf: cpfLimpo,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return {
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.ID,
                nome: usuario.nome,
                cargo: usuario.cargo,
                setor: usuario.setor
            }
        };
    },

    async cadastrar(usuario) {
        const senhaHash = await bcrypt.hash(usuario.senha, 10);
        
        const cpfLimpo = String(usuario.cpf).replace(/\D/g, '');

        const sql = `
            INSERT INTO usuarios
            (nome, CPF, email, senha, cargo, setor, tipo, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            usuario.nome,
            cpfLimpo,
            usuario.email,
            senhaHash,
            usuario.cargo,
            usuario.setor,
            'comum', 
            0         
        ]);

        return {
            mensagem: "Usuário cadastrado com sucesso",
            id: result.insertId
        };
    }
};

module.exports = authService;