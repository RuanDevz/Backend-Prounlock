const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const Authmiddleware = require('../Middleware/Auth');
const dotenv = require('dotenv');
dotenv.config();

router.get('/', async (req, res) => {
    const getallusers = await User.findAll();
    res.status(200).json(getallusers);
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
        console.error(error);
        res.status(500).json({ error: 'Erro ao verificar status VIP' });
    }
});

router.post('/register', async (req, res) => {
    const { password, email, ...users } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const existingemail = await User.findOne({ where: { email } });

    if (existingemail) {
        return res.status(409).json({ error: 'Email já cadastrado!' });
    }

    const createnewuser = await User.create({
        ...users,
        email,
        password: hashpassword,
    });

    res.status(201).json(createnewuser);
});

// Rota para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Credenciais incorretas!" });
    }

    const accesstoken = sign({ email: user.email, id: user.id }, process.env.TOKEN_VERIFY_ACCESS);

    res.json({ token: accesstoken, name: user.name });
});

// Rota para o dashboard do usuário
router.get('/dashboard', Authmiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.get('/user-data', Authmiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const benefits = user.isVip ? [
            "Access to 3 years of content with no ads.",
            "Access to all content before it's posted for free users.",
            "VIP badge on our Discord community.",
            "Early access to exclusive content and special newsletters.",
            "Priority support for viewing and accessing all content.",
            "Exclusive Q&A sessions, webinars, and personalized content."
        ] : [];

        res.status(200).json({
            name: user.name,
            email: user.email,
            isVip: user.isVip,
            benefits: benefits,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
