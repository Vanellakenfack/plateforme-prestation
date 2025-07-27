import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiTag, FiMapPin, FiImage, FiVideo } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';
// OwnerSidebar n'est plus importé ici car il est géré par Dashboard.js

// Configuration Axios pour l'API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const Services = () => {
  const [prestataireId, setPrestataireId] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie_id: '',
    prix: '',
    unite_prix: 'heure',
    localisation: '',
    photos: [],
    video: ''
  });

  // Configuration du token d'authentification
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Récupère l'id de l'utilisateur connecté et le définit comme prestataireId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.warn('Aucun token trouvé, redirection vers la connexion.');
          // window.location.href = '/login'; // Décommenter si vous avez une route de connexion
          return;
        }

        const res = await api.get('/user');
        if (res.data && res.data.id) {
            setPrestataireId(res.data.id);
        } else {
            console.error('L\'ID utilisateur n\'est pas disponible dans la réponse de l\'API /user.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);


  // Récupère les services du prestataire une fois que prestataireId est disponible
  useEffect(() => {
    if (prestataireId) {
      fetchServices();
      fetchCategories(); // Récupérer les catégories aussi
    }
  }, [prestataireId]); // Dépend de prestataireId

  const fetchServices = async () => {
    if (!prestataireId) {
        console.warn("prestataireId n'est pas encore défini, ne peut pas charger les services.");
        return;
    }
    try {
      const res = await api.get(`/services/prestataire/${prestataireId}`);
      setServices(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error.response?.data || error.message);
      setServices([]); // Assurez-vous que l'état est vide en cas d'erreur
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories'); // Assurez-vous d'avoir une route API pour les catégories
      setCategories(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error.response?.data || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePhotosChange = (e) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      photos: value ? value.split(',').map(url => url.trim()) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (!isEditing && !dataToSend.prestataire_id) {
          dataToSend.prestataire_id = prestataireId; // Ajouter l'ID si c'est un nouvel ajout
      }

      if (isEditing) {
        await api.put(`/services/${currentService.id}`, dataToSend);
        alert('Service mis à jour avec succès !');
      } else {
        await api.post('/services', dataToSend);
        alert('Service ajouté avec succès !');
      }
      setShowModal(false);
      fetchServices(); // Rafraîchir la liste après ajout/modification
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du service:', error.response?.data || error.message);
      alert('Erreur lors de l\'enregistrement du service.');
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setFormData({
      titre: service.titre,
      description: service.description,
      categorie_id: service.categorie_id,
      prix: service.prix,
      unite_prix: service.unite_prix,
      localisation: service.localisation,
      photos: service.photos || [],
      video: service.video || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        alert('Service supprimé avec succès !');
        fetchServices(); // Rafraîchir la liste après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression du service:', error.response?.data || error.message);
        alert('Erreur lors de la suppression du service.');
      }
    }
  };

  const handleNewService = () => {
    setIsEditing(false);
    setCurrentService(null);
    setFormData({
      titre: '',
      description: '',
      categorie_id: '',
      prix: '',
      unite_prix: 'heure',
      localisation: '',
      photos: [],
      video: ''
    });
    setShowModal(true);
  };

  // Filtration et Pagination
  const filteredServices = services.filter(service =>
    service.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.category && (service.category.name || service.category.nom).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  // Fonction de gestion du changement de page (ajoutée pour résoudre l'erreur no-undef)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <> {/* Utilisation d'un Fragment pour envelopper le contenu */}
<OwnerSidebar></OwnerSidebar>   
   <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pt-4 gap-3">
        <h2 className="mb-0 fw-bold text-primary">Gestion des Services</h2>

        <div className="d-flex flex-column flex-md-row gap-3 w-100 w-md-auto">
          <div className="input-group flex-nowrap" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-white border-end-0">
              <FiSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn d-flex align-items-center justify-content-center px-3 py-2"
            style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #007bff 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              setFormData({
                titre: '',
                description: '',
                categorie_id: '',
                prix: '',
                unite_prix: 'heure',
                localisation: '',
                photos: [],
                video: ''
              });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            <FiPlus className="me-2" size={18} />
            Ajouter un service
          </button>
        </div>
      </div>

      {/* Tableau des services */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-primary text-white">
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '15%' }}>Titre</th>
                  <th style={{ width: '12%' }}>Catégorie</th>
                  <th style={{ width: '20%' }}>Description</th>
                  <th style={{ width: '10%' }}>Prix</th>
                  <th style={{ width: '10%' }}>Localisation</th>
                  <th style={{ width: '10%' }}>Média</th>
                  <th style={{ width: '8%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      {searchTerm ? 'Aucun service correspondant à votre recherche' : 'Aucun service disponible'}
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((service, idx) => (
                    <tr key={service.id} className="align-middle">
                      <td className="fw-bold text-muted">{(currentPage - 1) * servicesPerPage + idx + 1}</td>
                      <td>
                        <span className="fw-semibold text-dark">{service.titre}</span>
                      </td>
                        <td>
                          <span className="badge rounded-pill py-2 px-3" style={{
                            background: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '0.85rem'
                          }}>
                            {categories.find(c => c.id === service.categorie_id)?.name ??
                            categories.find(c => c.id === service.categorie_id)?.nom ??
                            service.categorie_id}
                          </span>
                        </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '300px' }} title={service.description}>
                          {service.description}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-primary">{service.prix} FC</span>
                          <small className="text-muted">{service.unite_prix}</small>
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={service.localisation}>
                          {service.localisation}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {service.photos?.[0] && (
                            <img
                              src={service.photos[0]}
                              alt="Service"
                              className="rounded"
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                border: '1px solid #dee2e6'
                              }}
                            />
                          )}
                          {service.video && (
                            <a
                              href={service.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary p-1"
                              style={{ width: '40px', height: '40px' }}
                              title="Voir vidéo"
                            >
                              <i className="bi bi-play-fill"></i>
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary p-2"
                            title="Modifier"
                            onClick={() => handleEdit(service)}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-2"
                            title="Supprimer"
                            onClick={() => handleDelete(service.id)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredServices.length > servicesPerPage && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Affichage de {(currentPage - 1) * servicesPerPage + 1} à{' '}
            {Math.min(currentPage * servicesPerPage, filteredServices.length)} sur{' '}
            {filteredServices.length} services
          </div>
          <nav>
            <ul className="pagination pagination-sm">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &laquo;
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item${currentPage === i + 1 ? ' active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Modal pour ajouter/modifier un service */}
      {showModal && (
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" aria-labelledby="serviceModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEditing ? 'Modifier le service' : 'Ajouter un nouveau service'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Titre du service</label>
                      <input
                        type="text"
                        className="form-control"
                        name="titre"
                        value={formData.titre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Catégorie</label>
                      <select
                        className="form-select"
                        name="categorie_id"
                        value={formData.categorie_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name || cat.nom}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Prix (FC)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Unité de prix</label>
                      <select
                        className="form-select"
                        name="unite_prix"
                        value={formData.unite_prix}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="heure">Heure</option>
                        <option value="jour">Jour</option>
                        <option value="forfait">Forfait</option>
                        <option value="unite">Unité</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Localisation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="localisation"
                        value={formData.localisation}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Photos (URLs séparées par des virgules)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="photos"
                        value={formData.photos.join(',')}
                        onChange={handlePhotosChange}
                        placeholder="https://exemple.com/photo1.jpg, https://exemple.com/photo2.jpg"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Lien vidéo (optionnel)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="video"
                        value={formData.video}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    {isEditing ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Services;
