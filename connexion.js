import express from 'express';
import db from './db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { nom, email, mdp, role } = req.body;

        // Validation
        if (!nom || !email || !mdp || !role) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Vérification dans la base de données
        const result = await db.query(
            `SELECT * FROM  utilisateur
             WHERE nom = $1 
             AND email = $2 
             AND motdepasse = $3
             AND role = $4`,
            [nom, email, mdp, role]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Réponse avec succès
        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            user: {
                nom: result.rows[0].nom,
                email: result.rows[0].email,
                role: result.rows[0].role
            }
            // Pas besoin d'envoyer redirectTo car la logique est gérée côté front
        });

    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

export default router;