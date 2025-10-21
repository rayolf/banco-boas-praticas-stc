const express = require('express');
const router = express.Router();
const Practice = require('../models/Practice');

// GET - Buscar todas as práticas
router.get('/', async (req, res) => {
  try {
    const practices = await Practice.find().sort({ createdAt: -1 });
    res.json(practices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Criar nova prática
router.post('/', async (req, res) => {
  const practice = new Practice({
    name: req.body.name,
    management: req.body.management,
    practice: req.body.practice,
    date: req.body.date
  });

  try {
    const newPractice = await practice.save();
    res.status(201).json(newPractice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Buscar prática por ID
router.get('/:id', async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);
    if (!practice) {
      return res.status(404).json({ message: 'Prática não encontrada' });
    }
    res.json(practice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Excluir prática
router.delete('/:id', async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);
    if (!practice) {
      return res.status(404).json({ message: 'Prática não encontrada' });
    }
    
    await Practice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prática excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Buscar práticas por termo
router.get('/search/:term', async (req, res) => {
  try {
    const practices = await Practice.find({
      $or: [
        { practice: { $regex: req.params.term, $options: 'i' } },
        { name: { $regex: req.params.term, $options: 'i' } },
        { management: { $regex: req.params.term, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(practices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;