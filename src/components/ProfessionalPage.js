
import '../assets/css/prop.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './common/Header'
import {
  FiSearch, FiStar, FiMapPin, FiCheckCircle,
  FiFilter, FiClock, FiChevronDown
} from 'react-icons/fi';
import { MdOutlineVerified, MdEuroSymbol } from 'react-icons/md';

const ProfessionalsPage = () => {
  // États pour les données et le filtrage
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    service: '',
    rating: '',
    price: '',
    availability: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Données simulées de professionnels
  const demoProfessionals = [
    {
      id: 1,
      name: 'Sophie Martin',
      service: 'coiffure',
      specialty: 'Coiffeuse à domicile',
      rating: 4.9,
      reviews: 127,
      price: 50,
      availableNow: true,
      verified: true,
      experience: '8 ans',
      image: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.0.3',
      location: 'Paris 15e'
    },
    {
      id: 2,
      name: 'CleanPro Services',
      service: 'nettoyage',
      specialty: 'Entreprise de nettoyage',
      rating: 4.8,
      reviews: 256,
      price: 35,
      availableNow: true,
      verified: true,
      experience: '12 ans',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3',
      location: 'Marseille'
    },
    {
      id: 3,
      name: 'Alex Tech',
      service: 'informatique',
      specialty: 'Développeur web',
      rating: 4.7,
      reviews: 89,
      price: 65,
      availableNow: false,
      verified: true,
      experience: '5 ans',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      location: 'Lyon'
    },
    {
      id: 4,
      name: 'Julie Formation',
      service: 'education',
      specialty: 'Formatrice en langues',
      rating: 4.6,
      reviews: 42,
      price: 40,
      availableNow: true,
      verified: false,
      experience: '3 ans',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
      location: 'Toulouse'
    }
  ];

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setProfessionals(demoProfessionals);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrage des professionnels
  const filteredPros = professionals.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pro.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = !filters.service || pro.service === filters.service;
    const matchesRating = !filters.rating || pro.rating >= parseFloat(filters.rating);
    const matchesPrice = !filters.price || (
      filters.price === 'low' && pro.price < 40 ||
      filters.price === 'medium' && pro.price >= 40 && pro.price < 70 ||
      filters.price === 'high' && pro.price >= 70
    );
    const matchesAvailability = !filters.availability || 
                              (filters.availability === 'now' && pro.availableNow);

    return matchesSearch && matchesService && matchesRating && matchesPrice && matchesAvailability;
  });

  // Services disponibles pour le filtre
  const availableServices = [...new Set(professionals.map(pro => pro.service))];

  return (
    <>
    <Header/>
    
    <div className="all-professionals-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Trouvez tous nos professionnels</h1>
          <p>Connectez-vous avec les meilleurs experts près de chez vous</p>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <div className="search-input">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un professionnel ou un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filtres
            </button>
          </div>

          {/* Panneau de filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="filters-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="filter-group">
                  <h4>Service</h4>
                  <select
                    value={filters.service}
                    onChange={(e) => setFilters({...filters, service: e.target.value})}
                  >
                    <option value="">Tous les services</option>
                    {availableServices.map(service => (
                      <option key={service} value={service}>
                        {service === 'coiffure' && 'Coiffure'}
                        {service === 'nettoyage' && 'Nettoyage'}
                        {service === 'informatique' && 'Informatique'}
                        {service === 'education' && 'Formation'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <h4>Note minimale</h4>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  >
                    <option value="">Toutes notes</option>
                    <option value="4">4 étoiles et plus</option>
                    <option value="4.5">4.5 étoiles et plus</option>
                  </select>
                </div>

                <div className="filter-group">
                  <h4>Tarif horaire</h4>
                  <select
                    value={filters.price}
                    onChange={(e) => setFilters({...filters, price: e.target.value})}
                  >
                    <option value="">Tous tarifs</option>
                    <option value="low">Moins de 40€</option>
                    <option value="medium">40€ à 70€</option>
                    <option value="high">Plus de 70€</option>
                  </select>
                </div>

                <div className="filter-group">
                  <h4>Disponibilité</h4>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.availability === 'now'}
                      onChange={(e) => setFilters({
                        ...filters,
                        availability: e.target.checked ? 'now' : ''
                      })}
                    />
                    Disponible maintenant
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Résultats */}
      <section className="results-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des professionnels...</p>
            </div>
          ) : filteredPros.length > 0 ? (
            <div className="professionals-grid">
              {filteredPros.map((pro) => (
                <motion.div
                  key={pro.id}
                  className="professional-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="card-header">
                    <img src={pro.image} alt={pro.name} />
                    {pro.verified && (
                      <div className="verified-badge">
                        <MdOutlineVerified /> Vérifié
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{pro.name}</h3>
                    <p className="specialty">{pro.specialty}</p>
                    
                    <div className="rating">
                      <FiStar className="star-icon" />
                      <span>{pro.rating}</span>
                      <span className="reviews">({pro.reviews} avis)</span>
                    </div>
                    
                    <div className="details">
                      <span className="price">
                        <MdEuroSymbol /> {pro.price} f/h
                      </span>
                      <span className="experience">
                        <FiCheckCircle /> {pro.experience}
                      </span>
                    </div>
                    
                    <div className="location">
                      <FiMapPin /> {pro.location}
                    </div>
                    
                    <div className={`availability ${pro.availableNow ? 'available' : 'unavailable'}`}>
                      <FiClock /> {pro.availableNow ? 'Disponible maintenant' : 'Disponible sur RDV'}
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn secondary">Contacter</button>
                    <a href='/professionel'> <button className="btn primary">Voir le profil</button></a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>Aucun professionnel trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    service: '',
                    rating: '',
                    price: '',
                    availability: ''
                  });
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default ProfessionalsPage;