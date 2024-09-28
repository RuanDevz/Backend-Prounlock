// routes/payment.js
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Chave secreta da Stripe

router.post('/vip-payment', async (req, res) => {
    const { email } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'VIP ALL CONTENT ACCESS',
              },
              unit_amount: 500, 
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          email: email,
        },
      });
  
      res.json({ url: session.url }); // Retorna a URL para o frontend
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
    }
  });

module.exports = router;
