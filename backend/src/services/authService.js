const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = {
    async login(cpf, senha) {
        const cpfLimpo = String(cpf).replace(/\D/g, '');

        let sql = `SELECT ID, nome, tipo, senha, cargo, setor FROM usuarios WHERE REPLACE(REPLACE(CPF, '.', ''), '-', '') = ?`;
        let [rows] = await db.execute(sql, [cpfLimpo]);

        let usuario = null;
        let tipo = null;
        let dadosExtras = {};

        if (rows.length > 0) {
            usuario = rows[0];
            tipo = usuario.tipo;
            dadosExtras = {
                cargo: usuario.cargo,
                setor: usuario.setor
            };
        } else {
            sql = `SELECT ID, Nome as nome, 'psicologo' as tipo, Senha as senha, CRP, Email, Telefone FROM psicologo WHERE REPLACE(REPLACE(CPF, '.', ''), '-', '') = ?`;
            [rows] = await db.execute(sql, [cpfLimpo]);

            if (rows.length > 0) {
                usuario = rows[0];
                tipo = 'psicologo';
                dadosExtras = {
                    crp: usuario.CRP,
                    email: usuario.Email,
                    telefone: usuario.Telefone
                };
            }
        }

        if (!usuario) {
            throw new Error("erro ao logar");
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error("erro ao logar");
        }

        const token = jwt.sign(
            {
                id: usuario.ID,
                cpf: cpfLimpo,
                nome: usuario.nome,
                tipo: tipo
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const usuarioRetorno = {
            id: usuario.ID,
            nome: usuario.nome,
            tipo: tipo,
            ...dadosExtras
        };

        return {
            mensagem: "Login realizado com sucesso",
            token,
            usuario: usuarioRetorno
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
