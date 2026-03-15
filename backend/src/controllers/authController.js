const authService = require('../services/authService');

const authController = {
    async login(req, res){
        try{
            const{ cpf, senha} = req.body;
            const resultado = await authService.login(cpf, senha);
            return res.status(200).json(resultado);
        } 
        
        catch (error) {
            return res.status(401).json({ erro: error.message});
        }
    },

    async cadastrar(req, res) {
        try{
            const{ nome, cpf, email, senha, cargo, setor} = req.body;
            const resultado = await authService.cadastrar({ nome, cpf, email, senha, cargo, setor });
            return res.status(201).json(resultado);
        }

        catch(error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({erro: 'CPF ou e-mail já cadastrado'});
            }
            return res.status(500).json({erro: 'Erro interno no servedor'});
        }
    }
};

module.exports = authController;