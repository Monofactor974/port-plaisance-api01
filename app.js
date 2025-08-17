const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyToken = require('./middlewares/auth');
require('dotenv').config();

const app = express();

// 🔧 Middlewares globaux
app.use(cors());
app.use(express.json());

// 🔗 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connexion à MongoDB réussie"))
.catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// 🌐 Routes publiques
app.use('/api/auth', require('./routes/authRoutes'));

// 🔒 Routes protégées (requièrent un token JWT valide)
app.use('/api/users', verifyToken, require('./routes/userRoutes'));
app.use('/api/catways/:id/reservations', verifyToken, require('./routes/reservationRoutes'));
app.use('/api/catways', verifyToken, require('./routes/catwayRoutes'));


// 🚪 Page d’accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API du port de plaisance Russell ⚓️');
});

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

// 🔹 Sert les fichiers HTML, CSS, etc.
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Route pour la documentation
app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});
