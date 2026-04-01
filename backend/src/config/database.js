const mysql = require("mysql2/promise");

const connection = mysql.createPool({ 
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

connection.getConnection()
    .then(() => console.log("Conectado ao MySQL com Promises!"))
    .catch(err => console.error("Erro ao conectar no banco:", err));

module.exports = connection;