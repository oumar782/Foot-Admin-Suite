import express from 'express';
import db from './db.js';

const router = express.Router();

// Middleware pour logger les requêtes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Route OPTIONS pour CORS
router.options('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

// Route POST /login corrigée
router.post('/login', async (req, res) => {
  try {
    const { nom, email, mdp, role } = req.body;

    // Validation des champs
    if (!nom || !email || !mdp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires',
        required: ['nom', 'email', 'mdp', 'role']
      });
    }

    // Requête SQL paramétrée
    const result = await db.query(
      `SELECT * FROM utilisateur
       WHERE nom = $1 AND email = $2
       AND motdepasse = $3 AND role = $4`,
      [nom, email, mdp, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    const user = result.rows[0];
    
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      user: {
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

export default router;