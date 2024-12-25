const express = require('express');
const router = express.Router();
const transporter = require('../Services/Emailsend');

// Rota para enviar e-mail
router.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const mailOptions = {
    from: email, // Endereço de quem enviou
    to: 'ruanbatista1509@gmail.com', // Seu endereço de destino
    subject: `Nova mensagem de ${name}`,
    text: `Você recebeu uma nova mensagem de ${name} (${email}):\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
  }
});

module.exports = router;
