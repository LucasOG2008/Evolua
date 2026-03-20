const Desafio = require('../models/Desafio');

const desafioController = {

    async listar(req, res) {
        try {
            const desafios = await Desafio.findAll();
            return res.json(desafios);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async criar(req, res) {
        try {
            const { titulo, descricao } = req.body;

            await Desafio.create({ titulo, descricao });

            return res.status(201).json({ mensagem: 'Desafio criado com sucesso' });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

};

module.exports = desafioController;