import express from 'express';
import db from './db.js';

const router = express.Router();

// Middleware pour logger les requêtes d'authentification
router.use((req, res, next) => {
  console.log(`Auth request: ${req.method} ${req.path}`);
  next();
});

router.post('/login', async (req, res) => {
    try {
        const { nom, email, mdp, role } = req.body;

        // Validation améliorée
        if (!nom || !email || !mdp || !role) {
            console.log('Champs manquants dans la requête:', req.body);
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires',
                requiredFields: ['nom', 'email', 'mdp', 'role']
            });
        }

        // Vérification dans la base de données avec gestion d'erreur améliorée
        let result;
        try {
            result = await db.query(
                `SELECT * FROM utilisateur
                 WHERE nom = $1 
                 AND email = $2 
                 AND motdepasse = $3
                 AND role = $4`,
                [nom, email, mdp, role]
            );
        } catch (dbError) {
            console.error('Erreur DB:', dbError);
            return res.status(500).json({
                success: false,
                message: 'Erreur de base de données',
                dbError: dbError.message
            });
        }

        if (result.rows.length === 0) {
            console.log('Identifiants incorrects pour:', email);
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        const user = result.rows[0];
        console.log('Connexion réussie pour:', user.email);

        // Réponse avec succès
        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            user: {
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Erreur inattendue:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: err.message
        });
    }
});

// Route GET pour vérifier que le endpoint est accessible
router.get('/login', (req, res) => {
    res.status(200).json({
        message: 'Endpoint /auth/login est opérationnel',
        method: 'POST requis pour authentification',
        requiredFields: ['nom', 'email', 'mdp', 'role']
    });
});

export default router;