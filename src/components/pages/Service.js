import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Importez axios
import '../../assets/css/service.css';
import Header from '../common/Header';

// Importez toutes les icônes nécessaires comme avant
import { 
  FiScissors, 
  FiShoppingBag, 
  FiCode, 
  FiWifi, 
  FiHome, 
  FiTruck,
  FiMusic,
  FiCamera,
  FiBook,
  FiHeart,
  FiMic,
  FiPieChart,
  FiStar,
  FiRefreshCw // Pour l'icône de chargement
} from 'react-icons/fi';
import { 
  MdOutlineCleaningServices, 
  MdOutlineComputer, 
  MdOutlineConstruction,
  MdOutlineElectricalServices,
  MdOutlinePlumbing,
  MdOutlineHandyman // <-- AJOUTÉ ICI
} from 'react-icons/md';
import { GiChefToque, GiTeacher } from 'react-icons/gi';
import { FaBaby, FaDog } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8000/api';

// Mappage des IDs de catégorie aux icônes (vous devrez adapter ceci à vos IDs réels)
// C'est une solution temporaire si vos catégories n'ont pas d'icône directement de l'API
const categoryIcons = {
  // Remplacez 'id_de_votre_categorie' par les IDs réels de vos catégories dans la DB
  // et associez-les aux icônes appropriées
  'tous': <FiStar className="service-icon" />, // Icône par défaut pour "Tous les services"
  'beaute': <FiScissors className="service-icon" />,
  'domicile': <MdOutlineCleaningServices className="service-icon" />,
  'tech': <FiCode className="service-icon" />,
  'formation': <GiTeacher className="service-icon" />,
  'evenement': <FiCamera className="service-icon" />,
  'plomberie': <MdOutlinePlumbing className="service-icon" />,
  'electricite': <MdOutlineElectricalServices className="service-icon" />,
  'maconnerie': <MdOutlineConstruction className="service-icon" />,
  'nettoyage': <MdOutlineCleaningServices className="service-icon" />,
  'autres': <MdOutlineHandyman className="service-icon" />, // Utilise l'icône maintenant importée
  // Ajoutez d'autres mappages si nécessaire
};


const Service = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [services, setServices] = useState([]); // Pour stocker les services réels de l'API
  const [categories, setCategories] = useState([]); // Pour stocker les catégories réelles de l'API
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur

  // Récupérer les catégories depuis le backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        // Ajoutez une option "Tous les services" au début de la liste
        setCategories([{ id: 'tous', name: 'Tous les services' }, ...res.data]);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories.');
      }
    };
    fetchCategories();
  }, []);

  // Récupérer les services depuis le backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (activeCategory !== 'tous') {
          // Si une catégorie spécifique est sélectionnée, utilisez son ID pour filtrer
          // Assurez-vous que l'ID de la catégorie correspond à ce que votre API attend
          const selectedCatObj = categories.find(cat => cat.id === activeCategory);
          if (selectedCatObj) {
            params.categorie_id = selectedCatObj.id; // Utilisez l'ID numérique de la catégorie
          }
        }
        
        const res = await axios.get(`${API_BASE_URL}/services`, { params });
        setServices(res.data.data); // L'API ServiceController::index renvoie { data: [], ... }
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err.response?.data || err.message);
        setError('Impossible de charger les services. Veuillez réessayer.');
        setServices([]); // Vider les services en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    // Ne lancez le fetch des services que si les catégories sont chargées
    // et que activeCategory est 'tous' ou qu'une catégorie spécifique est trouvée
    if (categories.length > 0) {
        fetchServices();
    }
  }, [activeCategory, categories]); // Re-fetch quand la catégorie active ou les catégories changent

  // Le filtrage se fait désormais côté backend via l'API, donc filteredServices est directement `services`
  const displayedServices = services;

  return (
    <div className="services-page">
      <Header/>
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Découvrez nos services exceptionnels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Des professionnels qualifiés pour répondre à tous vos besoins
          </motion.p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-filter">
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <FiRefreshCw className="spin-animation" size={40} /> Chargement des services...
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && displayedServices.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              Aucun service trouvé dans cette catégorie.
            </div>
          )}

          {!loading && !error && displayedServices.length > 0 && (
            <div className="services-grid">
              {displayedServices.map((service, index) => (
                <motion.div 
                  key={service.id}
                  className={`service-card ${service.featured ? 'featured' : ''}`} // 'featured' est une propriété du service
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="service-image-container">
                    <img 
                      // Utilise la première photo du service ou une image placeholder
                      src={service.photos && service.photos.length > 0 ? service.photos[0] : `https://placehold.co/400x250/cccccc/333333?text=${service.titre}`} 
                      alt={service.titre} 
                      className="service-image"
                      loading="lazy"
                    />
                    {/* Si vous avez une propriété 'popular' ou 'featured' dans votre modèle Service */}
                    {service.featured && ( // Assurez-vous que 'featured' existe dans votre modèle Service
                      <div className="featured-badge">
                        <FiStar className="featured-icon" />
                        <span>Populaire</span>
                      </div>
                    )}
                  </div>
                  <div className="service-content">
                    <div className="service-icon-container">
                      {/* Utilise l'icône mappée ou une icône par défaut */}
                      {categoryIcons[service.category?.id] || <FiStar className="service-icon" />} 
                    </div>
                    <h3 className="service-title">{service.titre}</h3> {/* 'titre' de l'API */}
                    <p className="service-description">{service.description}</p> {/* 'description' de l'API */}
                    <p className="service-price">
                        <strong>Prix:</strong> {service.prix} FC / {service.unite_prix}
                    </p>
                    <p className="service-location">
                        <strong>Localisation:</strong> {service.localisation}
                    </p>
                    {service.prestataire && (
                        <p className="service-provider">
                            <strong>Prestataire:</strong> {service.prestataire.name}
                        </p>
                    )}
                    <motion.button 
                      className="service-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Voir les pros
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Vous proposez un service ?</h2>
            <p>Rejoignez notre plateforme et augmentez votre visibilité</p>
            <div className="cta-buttons">
              <motion.button
                className="cta-btn primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Devenir professionnel
              </motion.button>
              <motion.button
                className="cta-btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                En savoir plus
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Service;
