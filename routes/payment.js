const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendConfirmationEmail = require('../Services/Emailsend');
const { User } = require('../models');

const router = express.Router();

router.post('/vip-payment', async (req, res) => {
    const { email, planType } = req.body;

    if (!email || !planType || !['monthly', 'annual'].includes(planType)) {
        return res.status(400).json({ error: 'Dados inválidos. Verifique o email e o tipo de plano.' });
    }

    const prices = {
        monthly: 'price_1Q3scFJycl4dGkMpsgd9qr2K',
        annual: 'price_1Q4Xs0Jycl4dGkMp70Su1XTg',
    };

    try {
        const calculateVipExpirationDate = (planType) => {
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            if (planType === 'monthly') {
                expirationDate.setMonth(expirationDate.getMonth() + 1);
            } else if (planType === 'annual') {
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            }
            return expirationDate;
        };

        const vipExpirationDate = calculateVipExpirationDate(planType);

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

        await sendConfirmationEmail(email);

        await User.update(
            {
                isVip: true,
                vipExpirationDate: vipExpirationDate,
            },
            {
                where: { email: email }
            }
        );

        res.json({ url: session.url });
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
    }
});

module.exports = router;
