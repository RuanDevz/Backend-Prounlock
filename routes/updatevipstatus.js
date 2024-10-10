const express = require('express');
const { User } = require('../models'); // Supondo que você tenha um modelo User definido
const router = express.Router();

// Rota para atualizar o status VIP do usuário
router.post('/', async (req, res) => {
  const { email } = req.body; // O e-mail do usuário vem do corpo da requisição

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.update(
      { isVip: true },
      { where: { email } }
    );

    res.status(200).json({ message: 'User VIP status updated successfully' });
  } catch (error) {
    console.error('Error updating VIP status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
