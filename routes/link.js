const express = require('express');
const router = express.Router();
const { Link } = require('../models'); 

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

router.get('/', async (req, res) => {
    try {
        const links = await Link.findAll();
        res.status(200).json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os links' });
    }
});

// Nova rota para buscar links por mês e ano
router.get('/filter/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    try {
        const links = await Link.findAll({
            where: {
                createdAt: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), year),
                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), month)
                    ]
                }
            }
        });
        res.status(200).json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os links' });
    }
});

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
