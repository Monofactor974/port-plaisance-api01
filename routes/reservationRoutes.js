const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/Reservation');

// 🔹 Lister les réservations pour un catway
router.get('/', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro de catway invalide' });
    }

    const reservations = await Reservation.find({ catwayNumber });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des réservations' });
  }
});

// 🔹 Détails d’une réservation précise
router.get('/:reservationId', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la réservation' });
  }
});

// 🔹 Créer une réservation pour un catway
router.post('/', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro de catway invalide' });
    }

    const reservation = new Reservation({
      ...req.body,
      catwayNumber
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Supprimer une réservation
router.delete('/:reservationId', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.reservationId);
    if (!deleted) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;