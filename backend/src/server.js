require("dotenv").config();
const app = require('./app');

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando na porta 3000");
});