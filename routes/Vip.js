const express = require('express');
const router = express.Router();
const { VIPContent, User } = require('../models'); 
const jwt = require('jsonwebtoken');

const verifyVIP = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (!user.isVip) {
      return res.status(403).json({ message: 'Acesso permitido apenas para usuários VIP' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido', error });
  }
};

router.get('/', async (req, res) => {
  try {
    const vipContent = await VIPContent.findAll(); 
    res.json(vipContent); 
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar conteúdo VIP', error });
  }
});

router.post('/', verifyVIP, async (req, res) => {
  const { name, link, author } = req.body;

  try {
    const newContent = await VIPContent.create({
      name,
      link,
      author,
    });

    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar conteúdo VIP', error });
  }
});

module.exports = router;
