import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
const Signin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'client'
  });

  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setRequirements({
        length: value.length >= 8,
        number: /\d/.test(value),
        uppercase: /[A-Z]/.test(value),
        special: /[!@#$%^&*]/.test(value)
      });
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #f3e8ff)' }}>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-100"
        style={{ maxWidth: '800px' }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3 shadow overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="progress" style={{ height: '8px' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: step === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.5 }}
              className="progress-bar bg-primary h-100"
            />
          </div>

          {/* Header */}
          <div className="bg-primary p-5 text-center">
            <motion.h1 variants={itemVariants} className="text-white fw-bold mb-3">
              {step === 1 ? 'Créez votre compte' : 'Complétez votre profil'}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-white-50 mb-0">
              {step === 1 ? 'Rejoignez notre communauté' : 'Personnalisez votre expérience'}
            </motion.p>
          </div>

          {/* Form */}
          <motion.div variants={containerVariants} className="p-5">
            {step === 1 ? (
              <>
                <motion.div variants={itemVariants} className="mb-4">
                  <label className="form-label text-secondary">Nom complet</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <FaUser className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control py-3"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <label className="form-label text-secondary">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <FaEnvelope className="text-muted" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control py-3"
                      placeholder="votre@email.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <label className="form-label text-secondary">Téléphone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <FaPhone className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control py-3"
                      placeholder="6XX XXX XXX"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <label className="form-label text-secondary">Type de compte</label>
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'client' })}
                      className={`btn w-50 py-3 ${formData.userType === 'client' ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      Je cherche un service
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'pro' })}
                      className={`btn w-50 py-3 ${formData.userType === 'pro' ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      Je propose un service
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
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
                    />
                  </div>
                  <div className="row mt-2 g-2">
                    <div className={`col-6 d-flex align-items-center ${requirements.length ? 'text-success' : 'text-muted'}`}>
                      <FaCheck className="me-2" /> 8 caractères min
                    </div>
                    <div className={`col-6 d-flex align-items-center ${requirements.number ? 'text-success' : 'text-muted'}`}>
                      <FaCheck className="me-2" /> 1 chiffre
                    </div>
                    <div className={`col-6 d-flex align-items-center ${requirements.uppercase ? 'text-success' : 'text-muted'}`}>
                      <FaCheck className="me-2" /> 1 majuscule
                    </div>
                    <div className={`col-6 d-flex align-items-center ${requirements.special ? 'text-success' : 'text-muted'}`}>
                      <FaCheck className="me-2" /> 1 caractère spécial
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <label className="form-label text-secondary">Confirmez le mot de passe</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <FaLock className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control py-3"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {formData.userType === 'pro' && (
                  <motion.div variants={itemVariants} className="mb-4">
                    <label className="form-label text-secondary">Domaine d'expertise</label>
                    <select className="form-select py-3">
                      <option value="">Sélectionnez votre métier</option>
                      <option value="plomberie">Plomberie</option>
                      <option value="electricite">Électricité</option>
                      <option value="jardinage">Jardinage</option>
                    </select>
                  </motion.div>
                )}
              </>
            )}

            <motion.div variants={itemVariants} className="d-flex justify-content-between pt-4">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-link text-primary px-4 py-3"
                >
                  Retour
                </button>
              ) : (
                <div></div>
              )}
              
              {step === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ms-auto px-5 py-3 fw-bold"
                >
                  Continuer
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary ms-auto px-5 py-3 fw-bold"
                >
                  Créer mon compte
                </button>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center text-muted mt-4">
              Déjà membre ?{' '}
              <Link to="/login" className="text-primary fw-medium text-decoration-none">
                Connectez-vous
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signin;