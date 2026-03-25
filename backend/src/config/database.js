const mysql = require("mysql2");
const db = require("./config/database");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // coloca sua senha se tiver
    database: "evolua"
});

connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no banco:", err);
        return;
    }
    console.log("Conectado ao MySQL!");
});

module.exports = connection;