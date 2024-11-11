const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Importando o modelo de User
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Rota para pegar as estatísticas
router.get("/", async (req, res) => {
  try {
    // Total de usuários
    const totalUsers = await User.count();

    // Total de usuários VIP
    const totalVIPs = await User.count({ where: { isVip: true } });

    // Total de recomendações de conteúdo (supondo que você tenha esse modelo)
    const totalContentRecommendations = 1200;  // Exemplo estático, substitua conforme sua lógica.

    // Usuários do último mês
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const usersLastMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: oneMonthAgo,
        },
      },
    });

    // Porcentagem de VIPs
    const vipPercentage = totalUsers > 0 ? ((totalVIPs / totalUsers) * 100).toFixed(2) : 0;

    // Enviar os dados de estatísticas
    res.json({
      totalUsers,
      totalVIPs,
      totalContentRecommendations,
      usersLastMonth,
      vipPercentage,
    });
  } catch (error) {
    console.error("Erro ao buscar as estatísticas:", error);
    res.status(500).json({ message: "There was an error fetching the statistics." });
  }
});

module.exports = router;