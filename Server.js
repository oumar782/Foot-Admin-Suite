import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './connexion.js';
import demonstration from './BackendGestionnaire/ControlleurDemonstration/Demonstration.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Pour avoir __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS améliorée
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://footspace-solutions.vercel.app",
    "https://foot-admin-suite.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware pour pré-requêtes OPTIONS
app.options('*', cors(corsOptions));

// Sert les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes de l'api d'authentification
app.use('/auth', authRoutes);

// Routes pour les demonstrations
app.use('/api/demonstrations', demonstration);

// Sert l'app React pour les routes principales
app.get(
  [
    '/bienvenues',
    '/utilisateur',
    '/Gestionclient',
    '/Gestionreservation',
    '/Gestionpartenariats',
    '/Gestiondemonstration',
    '/administrateur.html'
  ],
  (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint non trouvé' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});