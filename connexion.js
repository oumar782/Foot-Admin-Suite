import express from 'express';
import db from './db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { nom, email, mdp, role } = req.body;

    // Validation des données
    if (!nom || !email || !mdp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Vérification en base de données
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

    // Réponse réussie
    return res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: result.rows[0].id,
        nom: result.rows[0].nom,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });

  } catch (err) {
    console.error('Erreur DB:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

export default router;