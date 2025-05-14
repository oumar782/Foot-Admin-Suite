//import { Pool } from 'pg';
//import dotenv from 'dotenv';

//dotenv.config();//

//const pool = new Pool({//
   // user: process.env.DB_USER,
    //host: process.env.DB_HOST,
    //database: process.env.DB_NAME,
   // password: process.env.DB_PASSWORD,
   // port: process.env.DB_PORT,
   // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false//
//});

// Test de connexion
//pool.query('SELECT NOW()')
   // .then(() => console.log('✅ Connecté à PostgreSQL'))
  //  .catch(err => console.error('❌ Erreur de connexion DB:', err));

//export default pool;





// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Connexion via Pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur connexion PostgreSQL :', err);
  } else {
    console.log('✅ Connecté à PostgreSQL avec succès à', res.rows[0].now);
  }
});

module.exports = pool;