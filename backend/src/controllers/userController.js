const User = require('../models/User');

const userController = {

    async listar(req, res) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });
        }
    }

};

module.exports = userController;