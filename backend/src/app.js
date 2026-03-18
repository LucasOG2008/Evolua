const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const desafioRoutes = require('./routes/desafioRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/desafios', desafioRoutes);

module.exports = app;