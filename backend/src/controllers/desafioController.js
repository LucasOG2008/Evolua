const Desafio = require('../models/Desafio');

const desafioController = {

    async listarDiario(req, res) {
        try {
            const desafios = await Desafio.findAll();
            if (!desafios.length) return res.status(404).json({ erro: 'Nenhum desafio cadastrado' });
            const indiceDia = Math.floor(Date.now() / 86400000) % desafios.length;
            return res.json(desafios[indiceDia]);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async listar(req, res) {
        try {
            const desafios = await Desafio.findAll();
            return res.json(desafios);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    async listarFormulario(req, res) {
        try {
            const perguntas = await Desafio.findFormulario();
            return res.json(perguntas);
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