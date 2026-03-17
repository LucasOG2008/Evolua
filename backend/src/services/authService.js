const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = {

    async login(cpf, senha){

        const sql = `SELECT * FROM usuarios WHERE cpf = ?`;

        const [rows] = await db.execute(sql, [cpf]);

        if(rows.length === 0){
            throw new Error("Usuário não encontrado");
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida){
            throw new Error("Senha inválida");
        }

        const token = jwt.sign(
            { id: usuario.id, cpf: usuario.cpf },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                cargo: usuario.cargo,
                setor: usuario.setor
            }
        };
    },

    async cadastrar(usuario){

        const senhaHash = await bcrypt.hash(usuario.senha, 10);

        const sql = `
            INSERT INTO usuarios
            (nome, cpf, email, senha, cargo, setor)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            usuario.nome,
            usuario.cpf,
            usuario.email,
            senhaHash,
            usuario.cargo,
            usuario.setor
        ]);

        return {
            mensagem: "Usuário cadastrado com sucesso",
            id: result.insertId
        };
    }

};

module.exports = authService;