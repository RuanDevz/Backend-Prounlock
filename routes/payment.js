const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendConfirmationEmail = require('../Services/Emailsend')

const router = express.Router();

router.post('/vip-payment', async (req, res) => {
  const { email, planType } = req.body;

  const prices = {
    monthly: 'price_1Q3scFJycl4dGkMpsgd9qr2K',
    annual: 'price_1Q4Xs0Jycl4dGkMp70Su1XTg',
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[planType],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/#/success`,
      cancel_url: `${process.env.FRONTEND_URL}/#/cancel`,
      metadata: {
        email: email,
        planType: planType,
      },
    });

    // Enviar e-mail de confirmação
    await sendConfirmationEmail(email);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
});

module.exports = router;
