const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');

// 🟢 Créer un catway
router.post('/', async (req, res) => {
  try {
    const newCatway = new Catway(req.body);
    const saved = await newCatway.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000 && err.keyValue?.catwayNumber) {
      return res.status(400).json({ error: `Le catway numéro ${req.body.catwayNumber} existe déjà.` });
    }
    res.status(400).json({ error: err.message || 'Création impossible' });
  }
});

// 📄 Liste complète des catways
router.get('/', async (req, res) => {
  try {
    const list = await Catway.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement des catways' });
  }
});

// 🔍 Chercher par numéro (⚠️ placer avant /:id)
router.get('/numero/:catwayNumber', async (req, res) => {
  const numero = Number(req.params.catwayNumber);
  if (isNaN(numero)) return res.status(400).json({ error: 'Numéro invalide' });

  try {
    const catway = await Catway.findOne({ catwayNumber: numero });
    if (!catway) return res.status(404).json({ error: 'Catway non trouvé avec ce numéro' });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche par numéro' });
  }
});

// 📌 Détail par ID Mongo
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway non trouvé' });
    res.json(catway);
  } catch {
    res.status(400).json({ error: 'ID invalide' });
  }
});

// 🛠️ Mise à jour d’un catway
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Catway.findByIdAndUpdate(
      req.params.id,
      { catwayState: req.body.catwayState },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Catway non trouvé' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Modification impossible' });
  }
});

// ❌ Supprimer un catway
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Catway.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Catway non trouvé' });
    res.json({ message: 'Catway supprimé' });
  } catch {
    res.status(400).json({ error: 'Suppression impossible' });
  }
});

module.exports = router;