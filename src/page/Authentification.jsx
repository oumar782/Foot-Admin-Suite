import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import './Authentification.css';

const AuthComponent = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mdp: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', isSuccess: false, show: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://foot-admin-suite.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Vérification de la réponse
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur de connexion');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentification échouée');
      }

      // Stockage des données utilisateur
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage({ text: 'Connexion réussie!', isSuccess: true, show: true });

      // Redirection
      setTimeout(() => {
        window.location.href = data.user.role === 'Administrateur' 
          ? '/administrateur.html' 
          : '/bienvenues';
      }, 1500);

    } catch (error) {
      setMessage({
        text: error.message || 'Erreur de communication avec le serveur',
        isSuccess: false,
        show: true
      });
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-app">
      <div className={`message-box ${message.isSuccess ? 'success' : 'error'} ${message.show ? 'show' : ''}`}>
        <span>{message.text}</span>
        <button className="close-btn" onClick={closeMessage}>&times;</button>
      </div>

      <div className="auth-container">
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}
        
        <div className="auth-header">
          <h1>FootSpace Admin Suite</h1>
          <p>Veuillez vous authentifier pour rejoindre votre poste</p>
        </div>
        
        <div className="auth-body">
          <form id="authForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <div className="input-field">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  placeholder="Entrez votre nom complet" 
                  value={formData.nom}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <div className="input-field">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Entrez votre email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="mdp">Mot de passe</label>
              <div className="input-field">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="mdp" 
                  name="mdp" 
                  placeholder="Créez un mot de passe" 
                  value={formData.mdp}
                  onChange={handleInputChange}
                  required 
                />
                {showPassword ? (
                  <EyeOff className="password-toggle" size={18} onClick={togglePasswordVisibility} />
                ) : (
                  <Eye className="password-toggle" size={18} onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <div className="input-field">
                <UserCircle className="input-icon" size={18} />
                <select 
                  id="role" 
                  name="role" 
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Sélectionnez votre rôle</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Gestionnaire">Gestionnaire</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;