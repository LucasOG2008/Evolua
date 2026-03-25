require('dotenv').config();
const express = require("express");
const app = express();

app.use(express.json());


app.post("/usuarios", (req, res) => {
    const { nome, cargo, setor, email, telefone, cpf, senha } = req.body;

    console.log(req.body);

    res.json({ message: "Usuário cadastrado com sucesso" });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

app.use(express.json());

const usuariosRoutes = require("./routes/usuarios");

app.use("/usuarios", usuariosRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});