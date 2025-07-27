import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configuration Axios (identique à Signin)
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Connexion
    const response = await api.post('/login', {
      email: formData.email,
      password: formData.password
    });

    const token = response.data.token;
    localStorage.setItem('auth_token', token);

    // 2. Configuration des headers pour les requêtes suivantes
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Récupération des infos utilisateur
    const userResponse = await api.get('/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const userData = userResponse.data;
    localStorage.setItem('user_type', userData.type);
    localStorage.setItem('user_data', JSON.stringify(userData));

    // 4. Redirection
    const redirectPath = userData.type === 'prestataire' 
      ? '/dashboard' 
      : '/clientdashboard';

    navigate(redirectPath, { 
      state: { freshLogin: true },
      replace: true
    });

    toast.success('Connexion réussie !');

  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data || error.message);

    let errorMessage = 'Erreur de connexion';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.response.status === 500) {
        errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }

    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)' }}>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-100"
        style={{ maxWidth: '500px' }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3 shadow overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary p-5 text-center">
            <motion.h1 
              variants={itemVariants}
              className="text-white fw-bold mb-3"
            >
              Connectez-vous
            </motion.h1>
            <motion.p variants={itemVariants} className="text-white-50 mb-0">
              Accédez à votre espace professionnel
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <motion.div variants={containerVariants} className="p-5">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="form-label text-secondary">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaUser className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control py-3"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4">
                <label className="form-label text-secondary">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaLock className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control py-3"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label text-muted">Se souvenir de moi</label>
                </div>
                <Link to="/forgot-password" className="text-primary text-decoration-none">
                  Mot de passe oublié ?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4">
                <button
                  type="submit"
                  className="w-100 btn btn-primary py-3 fw-bold"
                  disabled={loading || !formData.email || !formData.password}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="position-relative my-4">
                <div className="position-absolute top-50 start-0 end-0 border-top"></div>
                <div className="position-relative text-center">
                  <span className="px-3 bg-white text-muted">Ou continuer avec</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="d-flex gap-3 mb-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1 py-3"
                >
                  <FaGoogle className="text-danger me-2" />
                  <span>Google</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1 py-3"
                >
                  <FaFacebook className="text-primary me-2" />
                  <span>Facebook</span>
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center text-muted">
                Pas encore membre ?{' '}
                <Link to="/signin" className="text-primary fw-medium text-decoration-none">
                  Créer un compte
                </Link>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;