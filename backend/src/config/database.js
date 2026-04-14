require("dotenv").config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'evolua',
    port: 4040
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
    } else {
        console.log('Banco conectado!');
    }
});

module.exports = connection;