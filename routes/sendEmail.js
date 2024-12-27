const express = require('express');
const router = express.Router();
const sendEmail = require('../Services/Emailsend'); // Importa a função correta
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Importa o modelo de usuário

// Secret para o token de redefinição
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || process.env.TOKEN_VERIFY_ACCESS; // Use variável de ambiente

// Rota para enviar e-mail
router.post('/send-email', async (req, res) => {
  const { name, email, message, recovery } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo de e-mail é obrigatório.' });
  }

  try {
    if (recovery) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const token = jwt.sign({ userId: user.id }, RESET_PASSWORD_SECRET, { expiresIn: '1h' });

      const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${token}`;

      const recoveryMessage = `Olá, ${user.username || 'usuário'}!\n\nClique no link abaixo para redefinir sua senha:\n\n${resetLink}\n\nEste link expira em 1 hora.`;

      const formData = {
        name: user.username || 'Usuário',
        email: user.email,
        message: recoveryMessage,
      };

      await sendEmail(formData);
      return res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso.' });
    } else {
      // E-mail genérico
      if (!name || !message) {
        return res.status(400).json({ error: 'Os campos name e message são obrigatórios para e-mails genéricos.' });
      }

      const formData = { name, email, message };
      await sendEmail(formData);
      return res.status(200).json({ message: 'E-mail enviado com sucesso.' });
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
  }
});

module.exports = router;
