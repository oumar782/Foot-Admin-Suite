import express from 'express';
import cors from 'cors';
import authRoutes from './connexion.js';
import demons from './Gestionnaire/Demonstration/demonstration.js';


const app = express();

// Options CORS — ici tu peux limiter aux origines que tu veux, par exemple ton front
const corsOptions = {
  origin: 'https://foot-admin-suite.vercel.app', // l’URL de ton front déployé
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // méthodes autorisées
  credentials: true, // si tu utilises les cookies ou l’authentification
};

app.use(cors(corsOptions));

// Autres middlewares
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/demonstrations', demons);


// Route de test
app.get('/', (req, res) => {
  res.send('API d\'authentification opérationnelle');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});