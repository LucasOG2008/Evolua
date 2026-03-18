const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'segredo';

const autenticar = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }   

    try {
        const payload = jwt.verify(token, secret);
        req.usuario = payload;
        next();

    } catch {
        return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }

};

module.exports = {}