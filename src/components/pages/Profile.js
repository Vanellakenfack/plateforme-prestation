import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerSidebar from './pro/OwnerSidebar';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    adresse: ''
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    adresse: ''
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        // Adaptez cette partie selon la structure de votre réponse API
        const userData = res.data.user || res.data;
        setProfile(userData);
        setForm(userData);
      } catch (err) {
        setError("Impossible de charger le profil");
        console.error("Erreur API:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.put(`${API_BASE_URL}/profile`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProfile(res.data);
      setEditMode(false);
      setError(null);
      alert("Profil mis à jour avec succès!");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
      console.error("Erreur API:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Erreur</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4" style={{ marginLeft: '250px', minHeight: '100vh', background: '#f8fafc' }}>
      <OwnerSidebar />
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4 text-center">Mon Profil</h2>
          
          {!editMode ? (
            <div className="card p-4 shadow-sm mb-4">
              <div className="mb-3">
                <h5 className="text-muted mb-2">Nom</h5>
                <p className="fs-5 border-bottom pb-2">{profile.name}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-muted mb-2">Email</h5>
                <p className="fs-5 border-bottom pb-2">{profile.email}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-muted mb-2">Téléphone</h5>
                <p className="fs-5 border-bottom pb-2">{profile.phone || 'Non renseigné'}</p>
              </div>
              <div className="mb-4">
                <h5 className="text-muted mb-2">Adresse</h5>
                <p className="fs-5 border-bottom pb-2">{profile.adresse || 'Non renseignée'}</p>
              </div>
              <div className="d-grid">
                <button 
                  className="btn btn-primary py-2"
                  onClick={() => setEditMode(true)}
                >
                  Modifier mon profil
                </button>
              </div>
            </div>
          ) : (
            <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nom</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input 
                  type="email" 
                  className="form-control py-2" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Téléphone</label>
                <input 
                  type="tel" 
                  className="form-control py-2" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  pattern="[0-9]{10}"
                  title="10 chiffres requis"
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Adresse</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  name="adresse" 
                  value={form.adresse} 
                  onChange={handleChange} 
                />
              </div>
              <div className="d-flex gap-3">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary flex-grow-1 py-2"
                  onClick={() => setEditMode(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success flex-grow-1 py-2"
                >
                  Enregistrer
                  </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;