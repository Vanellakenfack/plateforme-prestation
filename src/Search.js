import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiShare2,
  FiBarChart2
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes pour la carte
const providerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const ServiceSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris par défaut

  // Filtres
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    availability: '',
    rating: 0,
    sortBy: 'relevance'
  });

  // Données simulées
  useEffect(() => {
    // Récupérer la requête de recherche depuis l'URL
    const query = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(query);

    // Simuler un chargement de données
    setTimeout(() => {
      const mockServices = [
        {
          id: 1,
          title: 'Plomberie complète',
          provider: 'Jean Dupont',
          rating: 4.8,
          reviews: 124,
          price: 45,
          priceType: 'heure',
          availability: 'Dès demain',
          location: [48.8588, 2.2944], // Tour Eiffel
          description: 'Services de plomberie résidentielle et commerciale avec garantie',
          category: 'plomberie'
        },
        {
          id: 2,
          title: 'Électricité générale',
          provider: 'Élec Pro',
          rating: 4.5,
          reviews: 89,
          price: 60,
          priceType: 'heure',
          availability: 'Disponible maintenant',
          location: [48.8606, 2.3376], // Louvre
          description: 'Installation et réparation électrique certifiée',
          category: 'électricité'
        },
        {
          id: 3,
          title: 'Jardinage paysager',
          provider: 'Green Thumb',
          rating: 4.9,
          reviews: 210,
          price: 35,
          priceType: 'heure',
          availability: 'Cette semaine',
          location: [48.8462, 2.3445], // Sorbonne
          description: 'Création et entretien de jardins écologiques',
          category: 'jardinage'
        },
        {
          id: 4,
          title: 'Cours de piano',
          provider: 'Musique & Vous',
          rating: 4.7,
          reviews: 56,
          price: 30,
          priceType: 'heure',
          availability: 'Prochains créaux disponibles',
          location: [48.8768, 2.3594], // Sacré-Cœur
          description: 'Cours particuliers pour tous niveaux',
          category: 'formation'
        }
      ];

      setServices(mockServices);
      setFilteredServices(mockServices);
      setLoading(false);

      // Centrer la carte sur le premier résultat
      if (mockServices.length > 0) {
        setMapCenter(mockServices[0].location);
      }
    }, 1000);
  }, [location.search]);

  // Appliquer les filtres
  useEffect(() => {
    let results = [...services];

    // Filtre par prix
    results = results.filter(service => 
      service.price >= filters.priceRange[0] && 
      service.price <= filters.priceRange[1]
    );

    // Filtre par disponibilité
    if (filters.availability === 'now') {
      results = results.filter(service => service.availability.includes('maintenant'));
    } else if (filters.availability === 'tomorrow') {
      results = results.filter(service => service.availability.includes('demain'));
    }

    // Filtre par note
    if (filters.rating > 0) {
      results = results.filter(service => service.rating >= filters.rating);
    }

    // Tri des résultats
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'relevance'
        results.sort((a, b) => b.rating - a.rating); // Par défaut tri par note
    }

    setFilteredServices(results);
  }, [filters, services]);

  // Gestion des favoris
  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  // Gestion de la comparaison
  const toggleCompare = (serviceId) => {
    if (compareList.includes(serviceId)) {
      setCompareList(compareList.filter(id => id !== serviceId));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, serviceId]);
      } else {
        alert('Vous ne pouvez comparer que 3 prestataires maximum');
      }
    }
  };

  // Redirection vers la page de comparaison
  const navigateToCompare = () => {
    if (compareList.length > 1) {
      navigate(`/compare?ids=${compareList.join(',')}`);
    } else {
      alert('Sélectionnez au moins 2 prestataires à comparer');
    }
  };

  return (
    <div className="service-search-page container-fluid py-4">
      <div className="row">
        {/* Colonne de recherche et filtres */}
        <div className="col-lg-4 col-xl-3 mb-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="mb-4">
                <FiSearch className="me-2" />
                Rechercher
              </h5>
              
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button 
                className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-between"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span>
                  <FiFilter className="me-2" />
                  Filtres avancés
                </span>
                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {showFilters && (
                <div className="filters-section mb-4">
                  <div className="mb-3">
                    <label className="form-label">Fourchette de prix (€)</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control me-2"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                        })}
                      />
                      <span className="mx-2">à</span>
                      <input
                        type="number"
                        className="form-control ms-2"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                        })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Disponibilité</label>
                    <select
                      className="form-select"
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    >
                      <option value="">Toutes les disponibilités</option>
                      <option value="now">Disponible maintenant</option>
                      <option value="tomorrow">Dès demain</option>
                      <option value="week">Cette semaine</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Note minimum</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`btn btn-sm ${filters.rating >= star ? 'text-warning' : 'text-muted'}`}
                          onClick={() => setFilters({ 
                            ...filters, 
                            rating: filters.rating === star ? 0 : star 
                          })}
                        >
                          <FiStar fill={filters.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trier par</label>
                    <select
                      className="form-select"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="rating">Meilleures notes</option>
                    </select>
                  </div>
                </div>
              )}

              {compareList.length > 0 && (
                <div className="compare-section">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Comparaison ({compareList.length}/3)</h6>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={navigateToCompare}
                      disabled={compareList.length < 2}
                    >
                      Comparer
                    </button>
                  </div>
                  <div className="selected-items">
                    {services
                      .filter(service => compareList.includes(service.id))
                      .map(service => (
                        <div key={service.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <span>{service.title}</span>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => toggleCompare(service.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne des résultats */}
        <div className="col-lg-8 col-xl-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              {filteredServices.length} résultats pour "{searchQuery}"
            </h4>
            <div className="text-muted">
              Tri: {filters.sortBy === 'relevance' ? 'Pertinence' : 
                   filters.sortBy === 'price-asc' ? 'Prix croissant' :
                   filters.sortBy === 'price-desc' ? 'Prix décroissant' : 'Meilleures notes'}
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <h5>Aucun service trouvé</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setFilters({
                    priceRange: [0, 500],
                    availability: '',
                    rating: 0,
                    sortBy: 'relevance'
                  })}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          ) : (
            <div className="service-list">
              {filteredServices.map(service => (
                <div key={service.id} className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="d-flex align-items-start">
                          <div className="me-3">
                            <div className="bg-light rounded p-2 text-center" style={{ width: '60px' }}>
                              <FiDollarSign size={24} className="text-primary" />
                              <div className="fw-bold mt-1">{service.price}€/{service.priceType}</div>
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1">{service.title}</h5>
                            <p className="text-muted mb-2">{service.provider}</p>
                            <div className="d-flex align-items-center mb-2">
                              <div className="text-warning me-2">
                                <FiStar fill="currentColor" />
                                <span className="ms-1">{service.rating}</span>
                              </div>
                              <span className="text-muted">({service.reviews} avis)</span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              <span className="badge bg-light text-dark">
                                <FiMapPin className="me-1" />
                                {service.location[0].toFixed(4)}, {service.location[1].toFixed(4)}
                              </span>
                              <span className="badge bg-light text-dark">
                                <FiCalendar className="me-1" />
                                {service.availability}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mt-3 mt-md-0">
                        <div className="d-flex flex-column h-100">
                          <div className="mb-2">
                            <button 
                              className={`btn btn-sm w-100 ${favorites.includes(service.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                              onClick={() => toggleFavorite(service.id)}
                            >
                              <FiHeart className="me-1" />
                              {favorites.includes(service.id) ? 'Favori' : 'Ajouter aux favoris'}
                            </button>
                          </div>
                          <div className="mb-2">
                            <button 
                              className={`btn btn-sm w-100 ${compareList.includes(service.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => toggleCompare(service.id)}
                            >
                              <FiBarChart2 className="me-1" />
                              {compareList.includes(service.id) ? 'Sélectionné' : 'Comparer'}
                            </button>
                          </div>
                          <div className="mt-auto">
                            <button className="btn btn-primary w-100">
                              Voir le profil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne de la carte */}
        <div className="col-xl-3 d-none d-xl-block">
          <div className="card sticky-top" style={{ top: '20px', height: 'calc(100vh - 40px)' }}>
            <div className="card-body p-0">
              <div className="map-container" style={{ height: '100%' }}>
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', borderRadius: '0.375rem' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredServices.map(service => (
                    <Marker 
                      key={service.id} 
                      position={service.location}
                      icon={providerIcon}
                    >
                      <Popup>
                        <div>
                          <h6>{service.title}</h6>
                          <p className="mb-1">{service.provider}</p>
                          <p className="mb-1">
                            <FiDollarSign className="me-1" />
                            {service.price}€/{service.priceType}
                          </p>
                          <p className="mb-1">
                            <FiStar className="me-1 text-warning" fill="currentColor" />
                            {service.rating} ({service.reviews} avis)
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .service-search-page {
          min-height: calc(100vh - 56px);
        }
        .star-rating {
          display: flex;
          gap: 0.25rem;
        }
        .map-container {
          border-radius: 0.375rem;
          overflow: hidden;
        }
        @media (max-width: 1199.98px) {
          .sticky-top {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceSearchPage;
