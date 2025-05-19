import express from 'express';
import cors from 'cors';
import authRoutes from './connexion.js';
import demons from './Gestionnaire/Demonstration/demonstration.js';

const app = express();

const allowedOrigins = [
  'https://foot-admin-suite.vercel.app',
  'http://localhost:5173' // dev local
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/demonstrations', demons);

app.get('/', (req, res) => {
  res.send("API d'authentification opérationnelle");
});

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
