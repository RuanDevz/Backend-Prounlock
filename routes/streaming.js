const express = require('express');
const { Content } = require('../models'); // Modelo Content
const router = express.Router();

// Rota GET para buscar links de um serviço específico de streaming
router.get('/:service', async (req, res) => {
  const { service } = req.params;

  try {
    const serviceLinks = await Content.findAll({
      where: { service: service },
    });

    if (serviceLinks.length === 0) {
      return res.status(404).json({ message: `Nenhum link encontrado para o serviço: ${service}` });
    }

    res.json(serviceLinks.map((link) => link.toJSON()));
  } catch (error) {
    console.error("Erro ao buscar links de streaming:", error);
    res.status(500).json({ message: 'Erro ao buscar os links do serviço de streaming' });
  }
});

// Rota GET para buscar todos os links
router.get('/', async (req, res) => {
  try {
    const allLinks = await Content.findAll();
    res.json(allLinks.map((link) => link.toJSON()));
  } catch (error) {
    console.error("Erro ao buscar todos os links:", error);
    res.status(500).json({ message: 'Erro ao buscar os links' });
  }
});

// Rota POST para criar um novo link de streaming
router.post('/', async (req, res) => {
  const { name, link, service, postDate } = req.body;

  try {
    const newContent = await Content.create({
      name,
      link,
      service,
      postDate: postDate || new Date().toISOString(),
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error("Erro ao criar o link de streaming:", error);
    res.status(500).json({ message: 'Erro ao criar o link de streaming' });
  }
});

// Rota PUT para atualizar um link de streaming existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, link, service, postDate } = req.body;

  try {
    const content = await Content.findByPk(id);

    if (!content) {
      return res.status(404).json({ message: `Link com ID ${id} não encontrado` });
    }

    content.name = name || content.name;
    content.link = link || content.link;
    content.service = service || content.service;
    content.postDate = postDate || content.postDate;

    await content.save();

    res.json(content);
  } catch (error) {
    console.error("Erro ao atualizar o link de streaming:", error);
    res.status(500).json({ message: 'Erro ao atualizar o link de streaming' });
  }
});

// Rota DELETE para excluir um link de streaming
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findByPk(id);

    if (!content) {
      return res.status(404).json({ message: `Link com ID ${id} não encontrado` });
    }

    await content.destroy();

    res.status(204).send(); // Retorna "No Content" após exclusão bem-sucedida
  } catch (error) {
    console.error("Erro ao excluir o link de streaming:", error);
    res.status(500).json({ message: 'Erro ao excluir o link de streaming' });
  }
});

module.exports = router;
