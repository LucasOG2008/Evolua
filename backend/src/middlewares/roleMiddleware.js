module.exports = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ erro: 'Não autenticado' });
        }

        if (!tiposPermitidos.includes(req.user.tipo)) {
            return res.status(403).json({
                erro: 'Acesso negado: você não tem permissão para este recurso'
            });
        }

        next();
    };
};