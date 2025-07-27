import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerSidebar from '../pro/OwnerSidebar';

const API_BASE_URL = 'http://localhost:8000/api';

const Profiles = () => {
  const [profile, setProfile] = useState(null); // Initialise à null, pas à un objet vide
  const [form, setForm] = useState({
    phone: '',
    ville: '',
    quartier: '',
    adresse: '',
    competences: '',
    experiences: '',
    reseaux: '',
    portfolio: '', // Garde le texte URL
    video: '',     // Garde le texte URL
    // Nouveaux champs ajoutés
    bio: '',
    website: '',
    hourly_rate: '',
  });
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null); // Pour le fichier portfolio
  const [videoFile, setVideoFile] = useState(null);     // Pour le fichier vidéo
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.warn('Aucun token trouvé, impossible de charger le profil.');
          alert("Veuillez vous connecter pour voir votre profil.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Réponse de l'API /profile:", res.data); // Ajoutez ce log pour voir la réponse

        // Si un profil existe, l'utiliser. Sinon, le laisser null et le formulaire restera vide.
        if (res.data) {
          setProfile(res.data);
          setForm({
            phone: res.data.phone || '',
            ville: res.data.ville || '',
            quartier: res.data.quartier || '',
            adresse: res.data.adresse || '',
            // Les compétences, expériences et réseaux sont stockés en JSON, il faut les parser
            // On gère le cas où ils sont déjà des tableaux (si le backend les décode) ou des chaînes
            competences: Array.isArray(res.data.competences) ? res.data.competences.join(', ') : (res.data.competences || ''),
            experiences: Array.isArray(res.data.experiences) ? res.data.experiences.join('\n') : (res.data.experiences || ''), // Si c'est un tableau, joindre par saut de ligne
            reseaux: typeof res.data.reseaux === 'object' && res.data.reseaux !== null ? JSON.stringify(res.data.reseaux) : (res.data.reseaux || ''),
            // Pour portfolio et video, on initialise le champ texte si c'est une URL, sinon on le vide
            portfolio: (res.data.portfolio && !res.data.portfolio.startsWith('profils/portfolio')) ? res.data.portfolio : '',
            video: (res.data.video && !res.data.video.startsWith('profils/videos')) ? res.data.video : '',
            // Initialisation des nouveaux champs
            bio: res.data.bio || '',
            website: res.data.website || '',
            hourly_rate: res.data.hourly_rate || '',
          });
          // Si le portfolio/vidéo est un fichier stocké, on ne met pas le champ texte
          if (res.data.portfolio && res.data.portfolio.startsWith('profils/portfolio')) {
            setPortfolioFile(res.data.portfolio); // Stocke le chemin du fichier existant (non le fichier lui-même)
          } else {
            setPortfolioFile(null);
          }
          if (res.data.video && res.data.video.startsWith('profils/videos')) {
            setVideoFile(res.data.video); // Stocke le chemin du fichier existant (non le fichier lui-même)
          } else {
            setVideoFile(null);
          }

          setEditMode(false); // S'il y a un profil, on est en mode affichage
        } else {
          // Si aucun profil n'existe, le formulaire reste avec des valeurs vides
          setProfile(null); // Assurez-vous que profile est bien null
          setEditMode(true); // Passe directement en mode édition pour créer le profil
          console.log("Aucun profil trouvé, passage en mode édition.");
        }
      } catch (e) {
        console.error("Erreur lors du chargement du profil:", e.response?.data || e.message);
        alert("Impossible de charger le profil. Veuillez réessayer. Vérifiez la console pour plus de détails.");
        // Si l'erreur est 404 (profil non trouvé), on peut passer en mode édition
        if (e.response && e.response.status === 404) {
          setEditMode(true);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));

    // Si l'utilisateur entre une URL pour portfolio/video, on vide le fichier sélectionné
    if (name === 'portfolio' && value) {
      setPortfolioFile(null);
    }
    if (name === 'video' && value) {
      setVideoFile(null);
    }
  };

  const handleFileChange = (e, setter, fieldName) => {
    setter(e.target.files[0]);
    // Si un fichier est sélectionné, vide le champ texte correspondant
    if (fieldName === 'portfolio') {
      setForm(prevForm => ({ ...prevForm, portfolio: '' }));
    }
    if (fieldName === 'video') {
      setForm(prevForm => ({ ...prevForm, video: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    // Convertir les compétences et réseaux en JSON avant d'envoyer
    const dataToSend = { ...form };
    if (dataToSend.competences) {
      dataToSend.competences = JSON.stringify(dataToSend.competences.split(',').map(s => s.trim()));
    } else {
      dataToSend.competences = JSON.stringify([]);
    }
    if (dataToSend.reseaux) {
      try {
        // Valider si le JSON est correct
        JSON.parse(dataToSend.reseaux);
      } catch (error) {
        alert("Le format des réseaux sociaux doit être un JSON valide. Ex: {\"LinkedIn\":\"https://...\"}");
        return;
      }
    } else {
      dataToSend.reseaux = JSON.stringify({});
    }

    // Ajouter les champs du formulaire à FormData, en gérant portfolio et video spécifiquement
    Object.entries(dataToSend).forEach(([key, value]) => {
        // Ne pas ajouter portfolio/video ici, ils seront gérés ci-dessous
        if (key === 'portfolio' || key === 'video') {
            return; 
        }
        if (key === 'competences' || key === 'reseaux') {
            formData.append(key, value);
        } else {
            formData.append(key, value);
        }
    });

    // Logique pour portfolio
    if (portfolioFile && typeof portfolioFile === 'object') { // Si un nouveau fichier est sélectionné
      formData.append('portfolio', portfolioFile);
    } else if (form.portfolio) { // Si une URL est entrée dans le champ texte
      formData.append('portfolio', form.portfolio);
    } else if (portfolioFile === null && profile?.portfolio && profile.portfolio.startsWith('profils/portfolio')) {
      // Si le fichier existant a été supprimé (portfolioFile est null) et qu'il y en avait un avant
      // Ne rien append pour ce champ, le backend le mettra à null
    }

    // Logique pour video
    if (videoFile && typeof videoFile === 'object') { // Si un nouveau fichier est sélectionné
      formData.append('video', videoFile);
    } else if (form.video) { // Si une URL est entrée dans le champ texte
      formData.append('video', form.video);
    } else if (videoFile === null && profile?.video && profile.video.startsWith('profils/videos')) {
      // Si le fichier existant a été supprimé (videoFile est null) et qu'il y en avait un avant
      // Ne rien append pour ce champ, le backend le mettra à null
    }

    try {
      let res;
      if (profile && profile.id) { // Si un profil existe déjà, on le met à jour
        formData.append('_method', 'put'); // Indique à Laravel que c'est une requête PUT
        res = await axios.post(`${API_BASE_URL}/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important pour les fichiers
            Authorization: `Bearer ${token}`
          }
        });
      } else { // Sinon, on crée un nouveau profil (qui est une requête POST)
        res = await axios.post(`${API_BASE_URL}/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setProfile(res.data);
      setEditMode(false);
      alert('Profil mis à jour !');
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err.response?.data || err.message);
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  // Fonction d'aide pour le rendu des réseaux sociaux
  const renderReseaux = (reseauxData) => {
    if (!reseauxData) return 'N/A';

    let parsedReseaux = reseauxData;
    if (typeof reseauxData === 'string') {
      try {
        parsedReseaux = JSON.parse(reseauxData);
      } catch (e) {
        console.error("Erreur de parsing JSON pour les réseaux sociaux:", e);
        return reseauxData; // Retourne la chaîne brute si le parsing échoue
      }
    }

    if (typeof parsedReseaux === 'object' && parsedReseaux !== null) {
      return Object.entries(parsedReseaux).map(([k, v]) => (
        <div key={k}><a href={v} target="_blank" rel="noopener noreferrer">{k}</a></div>
      ));
    }
    return reseauxData; // Fallback pour d'autres types ou si ce n'est pas un objet après parsing
  };


  if (loading) return <div>Chargement du profil...</div>;

  return (
    <div className="container-fluid px-4" style={{ marginLeft: '250px', minHeight: '100vh', background: '#f8fafc' }}>
      <OwnerSidebar />
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4 text-center">Mon Profil</h2>
          {!editMode ? (
            <div className="card p-4 shadow-sm mb-4">
              {profile && profile.photo && (
                <img src={`http://localhost:8000/storage/${profile.photo}`} alt="Avatar" className="rounded mb-3" style={{ width: 120, height: 120, objectFit: 'cover' }} />
              )}
              <div className="mb-3"><strong>Téléphone :</strong> {profile?.phone || 'N/A'}</div>
              <div className="mb-3"><strong>Ville : :</strong> {profile?.ville || 'N/A'}</div>
              <div className="mb-3"><strong>Quartier :</strong> {profile?.quartier || 'N/A'}</div>
              <div className="mb-3"><strong>Adresse :</strong> {profile?.adresse || 'N/A'}</div>
              <div className="mb-3"><strong>Compétences :</strong> {profile?.competences ? (Array.isArray(profile.competences) ? profile.competences.join(', ') : profile.competences) : 'N/A'}</div>
              <div className="mb-3"><strong>Expériences :</strong> {profile?.experiences || 'N/A'}</div>
              <div className="mb-3"><strong>Portfolio :</strong> {profile?.portfolio && (
                typeof profile.portfolio === 'string' && profile.portfolio.startsWith('profils/portfolio')
                  ? <a href={`http://localhost:8000/storage/${profile.portfolio}`} target="_blank" rel="noopener noreferrer">Voir le fichier</a>
                  : <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">{profile.portfolio}</a>
              ) || 'N/A'}</div>
              <div className="mb-3"><strong>CV :</strong> {profile?.cv && (
                <a href={`http://localhost:8000/storage/${profile.cv}`} target="_blank" rel="noopener noreferrer">Télécharger le CV</a>
              ) || 'N/A'}</div>
              <div className="mb-3"><strong>Vidéo :</strong> {profile?.video && (
                profile.video.startsWith('profils/videos')
                  ? <video src={`http://localhost:8000/storage/${profile.video}`} controls width="320" />
                  : <a href={profile.video} target="_blank" rel="noopener noreferrer">Voir la vidéo</a>
              ) || 'N/A'}</div>
              <div className="mb-3"><strong>Biographie :</strong> {profile?.bio || 'N/A'}</div> {/* Nouveau champ */}
              <div className="mb-3"><strong>Site Web :</strong> {profile?.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a> : 'N/A'}</div> {/* Nouveau champ */}
              <div className="mb-3"><strong>Taux Horaire :</strong> {profile?.hourly_rate ? `${profile.hourly_rate} FC` : 'N/A'}</div> {/* Nouveau champ */}
              <div className="mb-3"><strong>Réseaux :</strong> {renderReseaux(profile?.reseaux)}</div> {/* Utilisation de la fonction d'aide */}
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>Modifier mon profil</button>
            </div>
          ) : (
            <form className="card p-4 shadow-sm" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label fw-semibold">Photo</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => handleFileChange(e, setPhoto)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">CV</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={e => handleFileChange(e, setCv)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Portfolio (fichier ou lien)</label>
                <input type="file" className="form-control mb-2" onChange={e => handleFileChange(e, setPortfolioFile, 'portfolio')} />
                <input type="text" className="form-control" placeholder="Ou lien vers le portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Vidéo (fichier ou lien)</label>
                <input type="file" className="form-control mb-2" accept="video/*" onChange={e => handleFileChange(e, setVideoFile, 'video')} />
                <input type="text" className="form-control" placeholder="Ou lien vers la vidéo" name="video" value={form.video} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Téléphone</label>
                <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Ville</label>
                <input type="text" className="form-control" name="ville" value={form.ville} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Quartier</label>
                <input type="text" className="form-control" name="quartier" value={form.quartier} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Adresse</label>
                <input type="text" className="form-control" name="adresse" value={form.adresse} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Compétences (séparées par des virgules)</label>
                <input type="text" className="form-control" name="competences" value={form.competences} onChange={handleChange} placeholder="ex: React, Laravel, ..." />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Expériences</label>
                <textarea className="form-control" name="experiences" value={form.experiences} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Réseaux sociaux (JSON ou texte)</label>
                <input type="text" className="form-control" name="reseaux" value={form.reseaux} onChange={handleChange} placeholder='{"LinkedIn":"https://..."}' />
              </div>
              {/* Nouveaux champs pour l'édition */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Biographie</label>
                <textarea className="form-control" name="bio" rows="3" value={form.bio} onChange={handleChange} placeholder="Décrivez-vous en quelques mots..."></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Site Web</label>
                <input type="url" className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://votresite.com" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Taux Horaire (FC)</label>
                <input type="number" className="form-control" name="hourly_rate" value={form.hourly_rate} onChange={handleChange} placeholder="Ex: 5000" min="0" />
              </div>
              {/* Fin des nouveaux champs */}
              <div className="d-flex gap-3">
                <button type="button" className="btn btn-outline-secondary flex-grow-1 py-2" onClick={() => setEditMode(false)}>Annuler</button>
                <button type="submit" className="btn btn-success flex-grow-1 py-2">Enregistrer</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
