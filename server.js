import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// Configuration CORS étendue
const allowedOrigins = [
  'https://foot-admin-suite.vercel.app',
  'http://localhost:5173',
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
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware pour logger les requêtes (utile pour le débogage)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Base de données simulée avec utilisateurs de test
const users = [
  {
    id: 1,
    nom: 'Admin Test',
    email: 'admin@test.com',
    motdepasse: bcrypt.hashSync('admin123', 10),
    role: 'Administrateur'
  },
  {
    id: 2,
    nom: 'Gestionnaire Test',
    email: 'gest@test.com',
    motdepasse: bcrypt.hashSync('gest123', 10),
    role: 'Gestionnaire'
  }
];

// Route de login exactement comme attendu par le frontend
app.post('/api/auth/login', async (req, res) => {
  console.log('Requête de login reçue:', req.body); // Log pour débogage
  
  try {
    const { email, motdepasse } = req.body;

    // Validation basique
    if (!email || !motdepasse) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Recherche de l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Création du token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret-par-defaut',
      { expiresIn: '1h' }
    );

    // Réponse exactement comme attendue par le frontend
    return res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Erreur lors du login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.send('API opérationnelle');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erreur interne du serveur' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Testez avec POST http://localhost:${PORT}/api/auth/login`);
});