import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Animation variants
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
          <motion.div variants={containerVariants} className="p-5">
            <motion.div variants={itemVariants} className="mb-4">
              <label className="form-label text-secondary">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FaUser className="text-muted" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control py-3"
                  placeholder="votre@email.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control py-3"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
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
                className="w-100 btn btn-primary py-3 fw-bold"
              >
                Se connecter
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="position-relative my-4">
              <div className="position-absolute top-50 start-0 end-0 border-top"></div>
              <div className="position-relative text-center">
                <span className="px-3 bg-white text-muted">Ou continuer avec</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="d-flex gap-3 mb-4">
              <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1 py-3">
                <FaGoogle className="text-danger me-2" />
                <span>Google</span>
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1 py-3">
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;