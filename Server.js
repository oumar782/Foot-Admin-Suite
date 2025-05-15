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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS simplifiée
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://footspace-solutions.vercel.app",
    "https://foot-admin-suite.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Routes API
app.use('/auth', authRoutes);
app.use('/api/demonstrations', demonstration);

// Route de santé
app.get('/health', (req, res) => res.status(200).send('OK'));

// Routes React - Format corrigé
const reactRoutes = [
  '/bienvenues',
  '/utilisateur',
  '/Gestionclient',
  '/Gestionreservation',
  '/Gestionpartenariats',
  '/Gestiondemonstration',
  '/administrateur'
];

reactRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}