const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { nome, cargo, setor, email, telefone, cpf, senha } = req.body;

    console.log(req.body);

    res.json({ message: "Usuário cadastrado com sucesso" });
});

module.exports = router;