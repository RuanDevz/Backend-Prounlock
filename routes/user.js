const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const { sign } = require('jsonwebtoken');
const Authmiddleware = require('../Middleware/Auth');
const isAdmin = require('../Middleware/isAdmin');
const dotenv = require('dotenv');
dotenv.config();

router.get('/', Authmiddleware, isAdmin, async (req, res) => {
    try {
        const getallusers = await User.findAll();
        res.status(200).json(getallusers);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

router.get('/public-dashboard/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ 
            where: { 
                email: { [Op.iLike]: email }
            } 
        });
        console.log('Usuário retornado:', user);


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
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
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
      console.error(error);
      res.status(500).json({ error: 'Erro ao verificar status de admin' });
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
        console.error(error);
        res.status(500).json({ error: 'Erro ao verificar status VIP' });
    }
});

router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, senha e nome de usuário são obrigatórios!' });
    }

    try {
        const existingEmail = await User.findOne({ where: { email } });

        if (existingEmail) {
            return res.status(409).json({ error: 'Email já cadastrado!' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
        });

        const accesstoken = sign({ email: newUser.email, id: newUser.id }, process.env.TOKEN_VERIFY_ACCESS);

        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            token: accesstoken,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário. Tente novamente mais tarde.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Credenciais incorretas!" });
    }

    const accesstoken = sign({ email: user.email, id: user.id }, process.env.TOKEN_VERIFY_ACCESS);

    res.json({
        token: accesstoken,
        user: {
            username: user.username,  
            email: user.email,         
            isVip: user.isVip,         
            isAdmin: user.isAdmin,     
            name: user.name,          
            createdAt: user.createdAt, 
            updatedAt: user.updatedAt  
        }
    });
});


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
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});



module.exports = router;
