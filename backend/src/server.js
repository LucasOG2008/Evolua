require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

/* =========================
   CADASTRAR USUÁRIO (BANCO)
========================= */
app.post("/usuarios", (req, res) => {
    const { nome, cargo, setor, email, telefone, cpf, senha } = req.body;

    const sql = `
        INSERT INTO funcionarios 
        (nome, cargo, setor, email, telefone, cpf, senha) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, cargo, setor, email, telefone, cpf, senha], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao cadastrar" });
        }

        res.json({ message: "Usuário cadastrado com sucesso" });
    });
});

/* =========================
   LISTAR FUNCIONÁRIOS (BANCO)
========================= */
app.get("/funcionarios", (req, res) => {
    db.query("SELECT * FROM funcionarios", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao buscar" });
        }

        res.json(result);
    });
});

/* =========================
   BUSCAR FUNCIONÁRIO
========================= */
app.get("/funcionarios/busca", (req, res) => {
    const { nome } = req.query;

    const sql = "SELECT * FROM funcionarios WHERE nome LIKE ?";

    db.query(sql, [`%${nome}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erro na busca" });
        }

        res.json(result);
    });
});

/* =========================
   LISTAR PSICÓLOGOS (MOCK)
========================= */
app.get("/psicologos", (req, res) => {
    const psicologos = [
        { id: 1, nome: "Dr. João Silva" },
        { id: 2, nome: "Dra. Maria Santos" }
    ];

    res.json(psicologos);
});

/* ========================= */

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});