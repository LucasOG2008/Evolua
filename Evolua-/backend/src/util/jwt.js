const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'segredo';

const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '1d' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
};