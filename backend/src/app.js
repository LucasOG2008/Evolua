const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const desafioRoutes = require('./routes/desafioRoutes');

app.use('/users', userRoutes);
app.use('/desafios', desafioRoutes);

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

module.exports = app;