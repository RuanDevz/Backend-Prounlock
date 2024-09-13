const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { User } = require('./models'); 

router.post('/payment', async (req, res) => {
    const { email, paymentMethodId } = req.body;

    try {
        // Verifica se o usuário já existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ error: 'Usuário não encontrado.' });
        }

        // Cria o cliente no Stripe
        const customer = await stripe.customers.create({
            email: user.email,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Cria a assinatura para VIP mensal
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: 'price_1PyRRcJycl4dGkMpdx5o0Avu', // Substitua pelo ID do preço do seu plano de assinatura no Stripe
                },
            ],
            expand: ['latest_invoice.payment_intent'],
        });

        // Atualiza o usuário para VIP
        await User.update({ vip: true }, { where: { email: user.email } });

        res.send({
            message: 'Pagamento bem-sucedido. Assinatura VIP ativada!',
            subscriptionId: subscription.id,
        });

    } catch (error) {
        console.error('Erro no pagamento:', error);
        res.status(500).send({ error: 'Falha no pagamento.' });
    }
});

module.exports = router;
