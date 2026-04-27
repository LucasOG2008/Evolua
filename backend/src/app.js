const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../')));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const desafioRoutes = require('./routes/desafioRoutes');
const psicologoRoutes = require('./routes/psicologoRoutes');
const respostaRoutes = require('./routes/respostaRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/desafios', desafioRoutes);
app.use('/psicologos', psicologoRoutes);
app.use('/respostas', respostaRoutes);

module.exports = app;