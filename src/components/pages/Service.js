import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../assets/css/service.css'
import Header from '../common/Header';

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
  FiStar
} from 'react-icons/fi';
import { 
  MdOutlineCleaningServices, 
  MdOutlineComputer, 
  MdOutlineConstruction,
  MdOutlineElectricalServices,
  MdOutlinePlumbing
} from 'react-icons/md';
import { GiChefToque, GiTeacher } from 'react-icons/gi';
import { FaBaby, FaDog } from 'react-icons/fa';

const Service = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  
  const categories = [
    { id: 'tous', name: 'Tous les services' },
    { id: 'beaute', name: 'Beauté & Bien-être' },
    { id: 'domicile', name: 'Services à domicile' },
    { id: 'tech', name: 'Technologie' },
    { id: 'formation', name: 'Formations' },
    { id: 'evenement', name: 'Événements' }
  ];

  const services = [
    {
      id: 1,
      title: 'Coiffure à domicile',
      category: 'beaute',
      icon: <FiScissors className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3',
      description: 'Services professionnels de coiffure chez vous, à votre convenance.',
      featured: true
    },
    {
      id: 2,
      title: 'Nettoyage professionnel',
      category: 'domicile',
      icon: <MdOutlineCleaningServices className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1600580042228-868ddbe50d31?ixlib=rb-4.0.3',
      description: 'Nettoyage complet de votre domicile ou bureau par des professionnels.',
      featured: false
    },
    {
      id: 3,
      title: 'Développement web',
      category: 'tech',
      icon: <FiCode className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3',
      description: 'Création de sites web et applications sur mesure pour votre entreprise.',
      featured: true
    },
    {
      id: 4,
      title: 'Formation en informatique',
      category: 'formation',
      icon: <GiTeacher className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
      description: 'Cours particuliers ou en groupe pour maîtriser les outils informatiques.',
      featured: false
    },
    {
      id: 5,
      title: 'Plomberie',
      category: 'domicile',
      icon: <MdOutlinePlumbing className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3',
      description: 'Réparation et installation de systèmes de plomberie par des experts.',
      featured: true
    },
    {
      id: 6,
      title: 'Cours de musique',
      category: 'formation',
      icon: <FiMusic className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3',
      description: 'Apprenez à jouer d\'un instrument avec nos professeurs qualifiés.',
      featured: false
    },
    {
      id: 7,
      title: 'Photographie',
      category: 'evenement',
      icon: <FiCamera className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-4.0.3',
      description: 'Services photo professionnels pour vos événements spéciaux.',
      featured: true
    },
    {
      id: 8,
      title: 'Garde d\'enfants',
      category: 'domicile',
      icon: <FaBaby className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1544830798-9bf6a2c7ae7b?ixlib=rb-4.0.3',
      description: 'Garde d\'enfants fiable et professionnelle à votre domicile.',
      featured: false
    },
    {
      id: 9,
      title: 'Service traiteur',
      category: 'evenement',
      icon: <GiChefToque className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3',
      description: 'Catering de qualité pour vos événements privés ou professionnels.',
      featured: true
    },
    {
      id: 10,
      title: 'Développement mobile',
      category: 'tech',
      icon: <MdOutlineComputer className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3',
      description: 'Création d\'applications mobiles iOS et Android personnalisées.',
      featured: false
    },
    {
      id: 11,
      title: 'Garde d\'animaux',
      category: 'domicile',
      icon: <FaDog className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3',
      description: 'Services de garde et promenade pour vos animaux de compagnie.',
      featured: false
    },
    {
      id: 12,
      title: 'Coaching vocal',
      category: 'formation',
      icon: <FiMic className="service-icon" />,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3',
      description: 'Améliorez votre technique vocale avec nos coachs professionnels.',
      featured: true
    }
  ];

  const filteredServices = activeCategory === 'tous' 
    ? services 
    : services.filter(service => service.category === activeCategory);

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
          <div className="services-grid">
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id}
                className={`service-card ${service.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="service-image-container">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="service-image"
                    loading="lazy"
                  />
                  {service.featured && (
                    <div className="featured-badge">
                      <FiStar className="featured-icon" />
                      <span>Populaire</span>
                    </div>
                  )}
                </div>
                <div className="service-content">
                  <div className="service-icon-container">
                    {service.icon}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
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