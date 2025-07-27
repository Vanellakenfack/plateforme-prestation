import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheck, FaBriefcase } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const Signin = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
    type: 'client',
    metier: '',
    ville: '',
    adresse: '',
    bio: ''
  });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("8 caractères minimum");
    if (!/[A-Z]/.test(password)) errors.push("1 majuscule minimum");
    if (!/[a-z]/.test(password)) errors.push("1 minuscule minimum");
    if (!/[0-9]/.test(password)) errors.push("1 chiffre minimum");
    if (!/[!@#$%^&*]/.test(password)) errors.push("1 caractère spécial");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const nextStep = () => {
    if (!formData.nom || !formData.email || !formData.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error(`Mot de passe invalide: ${passwordErrors.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const userData = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        type: formData.type,
        ville: formData.ville,
        ...(formData.adresse && { adresse: formData.adresse }),
        ...(formData.bio && { bio: formData.bio })
      };

      if (formData.type === 'prestataire') {
        if (!formData.metier) {
          toast.error('Veuillez spécifier votre métier');
          setLoading(false);
          return;
        }
        userData.metier = formData.metier;
      }

      const response = await api.post('/register', userData);
      toast.success('Compte créé avec succès!');

      const loginResponse = await api.post('/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('auth_token', loginResponse.data.token);
      localStorage.setItem('user_type', formData.type);
      navigate(formData.type === 'prestataire' ? '/dashboard' : '/clientdashboard');

    } catch (error) {
      console.error('Erreur:', error.response?.data);
      if (error.response?.status === 422) {
        const errors = Object.values(error.response.data.errors).flat();
        toast.error(errors.join('\n'));
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #f3e8ff)' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-100"
        style={{ maxWidth: 500 }}
      >
        <div className="bg-primary p-5 text-center">
          <h1 className="text-white fw-bold mb-3">Inscrivez-vous</h1>
          <p className="text-white-50 mb-0">Accédez à votre espace</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-4 shadow-lg p-4 p-md-5">
          {step === 1 && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Nom complet <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaUser className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="form-control py-3"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Email <span className="text-danger">*</span></label>
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
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Téléphone <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaPhone className="text-muted" />
                  </span>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="form-control py-3"
                    placeholder="6XX XXX XXX"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Type de compte <span className="text-danger">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select py-3"
                  required
                >
                  <option value="client">Je cherche un service</option>
                  <option value="prestataire">Je propose un service</option>
                </select>
              </motion.div>
            </>
          )}

          {step === 2 && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Mot de passe <span className="text-danger">*</span></label>
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
                    placeholder="Mot de passe"
                    required
                  />
                </div>
                {passwordErrors.length > 0 && (
                  <ul className="text-danger small mt-2 mb-0">
                    {passwordErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Confirmer le mot de passe <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FaCheck className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="form-control py-3"
                    placeholder="Confirmez le mot de passe"
                    required
                  />
                </div>
              </motion.div>

              {formData.type === 'prestataire' && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    className="mb-4"
                  >
                    <label className="form-label text-secondary">Métier <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent">
                        <FaBriefcase className="text-muted" />
                      </span>
                      <select
                        name="metier"
                        value={formData.metier}
                        onChange={handleChange}
                        className="form-select py-3"
                        required
                      >
                        <option value="">Sélectionnez votre métier</option>
                        <option value="plombier">Plombier</option>
                        <option value="electricien">Électricien</option>
                        <option value="jardinier">Jardinier</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                    className="mb-4"
                  >
                    <label className="form-label text-secondary">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-control py-3"
                      rows="3"
                      placeholder="Décrivez vos compétences..."
                    />
                  </motion.div>
                </>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="form-control py-3"
                  placeholder="Votre ville"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                className="mb-4"
              >
                <label className="form-label text-secondary">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="form-control py-3"
                  placeholder="Votre adresse"
                />
              </motion.div>
            </>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            className="d-flex justify-content-between pt-4"
          >
            {step === 2 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-link text-primary px-4 py-3"
                disabled={loading}
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
                disabled={!formData.email || !formData.nom || !formData.telephone}
              >
                Continuer
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary ms-auto px-5 py-3 fw-bold"
                disabled={
                  loading ||
                  passwordErrors.length > 0 ||
                  formData.password !== formData.password_confirmation ||
                  (formData.type === 'prestataire' && !formData.metier)
                }
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
            className="text-center text-muted mt-4"
          >
            Déjà membre ?{' '}
            <Link to="/login" className="text-primary fw-medium text-decoration-none">
              Connectez-vous
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signin;