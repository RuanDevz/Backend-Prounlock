const express = require('express');
const router = express.Router();
const { Free } = require('../models');

router.post('/', async (req, res) => {
    try {
        const { name, link } = req.body;
        const newFreeContent = await Free.create({
            name,
            link,
        });
        res.status(201).json(newFreeContent);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o conteúdo gratuito' });
    }
});


router.get('/', async (req, res) => {
    try {
        const freeContents = await Free.findAll();
        res.status(200).json(freeContents);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os conteúdos gratuitos: ' + error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const freeContent = await Free.findByPk(id);
        if (!freeContent) {
            return res.status(404).json({ error: 'Conteúdo gratuito não encontrado' });
        }
        res.status(200).json(freeContent);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o conteúdo gratuito' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link } = req.body; 

        const freeContentToUpdate = await Free.findByPk(id);
        if (!freeContentToUpdate) {
            return res.status(404).json({ error: 'Conteúdo gratuito não encontrado' });
        }

        freeContentToUpdate.name = name;
        freeContentToUpdate.link = link;
        await freeContentToUpdate.save();

        res.status(200).json(freeContentToUpdate);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o conteúdo gratuito' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const freeContentToDelete = await Free.findByPk(id);
        if (!freeContentToDelete) {
            return res.status(404).json({ error: 'Conteúdo gratuito não encontrado' });
        }

        await freeContentToDelete.destroy();
        res.status(200).json({ message: 'Conteúdo gratuito deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o conteúdo gratuito' });
    }
});

module.exports = router;
