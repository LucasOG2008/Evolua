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
            tipo = usuario.tipo; // 'admin' ou 'comum'
            dadosExtras = {
                cargo: usuario.cargo,
                setor: usuario.setor
            };
        } else {
            // 2. Se não encontrou, tenta na tabela psicologo
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
            throw new Error("Usuário não encontrado");
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error("Senha inválida");
        }

        // Gera o token com as informações relevantes
        const token = jwt.sign(
            {
                id: usuario.ID,
                nome: usuario.nome,
                tipo: tipo
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Prepara o objeto de retorno
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
        // ... (mantenha o cadastro de usuário comum como está)
    }
};

module.exports = authService;