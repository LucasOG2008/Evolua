require("dotenv").config();
const app = require('./app');

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});