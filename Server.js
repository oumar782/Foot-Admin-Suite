import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './connexion.js';
import demonstration from './BackendGestionnaire/ControlleurDemonstration/Demonstration.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.urlencoded({ extended: true }));

// Middleware pour les requêtes OPTIONS
app.options('*', cors(corsOptions));

// Routes API
app.use('/auth', authRoutes);
app.use('/api/demonstrations', demonstration);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes React
app.get([
  '/',
  '/bienvenues',
  '/utilisateur',
  '/Gestionclient',
  '/Gestionreservation',
  '/Gestionpartenariats',
  '/Gestiondemonstration',
  '/administrateur.html'
], (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});