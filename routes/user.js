const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const Authmiddleware = require('../Middleware/Auth');
const isAdmin = require('../Middleware/isAdmin');
const dotenv = require('dotenv');
dotenv.config();

// Middleware para tratamento de erro unificado
const handleError = (error, res) => {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
};

// Rota para obter todos os usuários cadastrados (requer autenticação e se o usuário for administrador)
router.get('/', Authmiddleware, isAdmin, async (req, res) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json(allUsers);
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/is-admin/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({ isAdmin: user.isAdmin });
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/is-vip/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({ isVip: user.isVip });
    } catch (error) {
        handleError(error, res);
    }
});

// Rota para obter os dados do usuário logado (requer autenticação)
router.get('/dashboard', Authmiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        res.json({
            username: user.username,
            email: user.email,
            isVip: user.isVip,
            isAdmin: user.isAdmin,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;
