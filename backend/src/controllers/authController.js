const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    db.query(
        'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hash],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: 'Usuário criado!' });
        }
    );
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) return res.status(404).json({ msg: 'Usuário não encontrado' });

            const user = result[0];

            const valid = await bcrypt.compare(senha, user.senha);

            if (!valid) return res.status(401).json({ msg: 'Senha incorreta' });

            const token = jwt.sign({ id: user.id }, 'segredo', { expiresIn: '1d' });

            res.json({ token, user });
        }
    );
};