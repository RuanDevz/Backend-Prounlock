const express = require('express');
const router = express.Router();
const { Link } = require('../models'); // Certifique-se de que o caminho está correto

// Criar um novo link
router.post('/', async (req, res) => {
    const { name, link, author } = req.body;
    try {
        const newLink = await Link.create({ name, link, author });
        res.status(201).json(newLink);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o link' });
    }
});

// Obter todos os links
router.get('/', async (req, res) => {
    try {
        const links = await Link.findAll();
        res.status(200).json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os links' });
    }
});

// Obter um link específico pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const link = await Link.findByPk(id);
        if (!link) {
            return res.status(404).json({ error: 'Link não encontrado' });
        }
        res.status(200).json(link);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o link' });
    }
});

// Atualizar um link pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, link, author } = req.body;
    try {
        const linkToUpdate = await Link.findByPk(id);
        if (!linkToUpdate) {
            return res.status(404).json({ error: 'Link não encontrado' });
        }
        await linkToUpdate.update({ name, link, author });
        res.status(200).json(linkToUpdate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o link' });
    }
});

// Deletar um link pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const linkToDelete = await Link.findByPk(id);
        if (!linkToDelete) {
            return res.status(404).json({ error: 'Link não encontrado' });
        }
        await linkToDelete.destroy();
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o link' });
    }
});

module.exports = router;
