import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './assets/css/style.css';
import React, { useState } from 'react';
import { FiClock, FiMapPin, FiCheckCircle, FiStar, FiCalendar, FiFilter, FiSearch, FiChevronRight } from 'react-icons/fi';
import { MdPlumbing, MdElectricalServices, MdConstruction, MdCleaningServices, MdOutlineHandyman } from 'react-icons/md';
import { TbHomePlus } from 'react-icons/tb';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Données simulées
  const services = [
    { id: 1, name: 'Urgent', icon: <FiClock size={24} />, pros: 42, color: '#FF6B6B' },
    { id: 2, name: 'Plomberie', icon: <MdPlumbing size={24} />, pros: 245, color: '#4ECDC4' },
    { id: 3, name: 'Électricité', icon: <MdElectricalServices size={24} />, pros: 189, color: '#45B7D1' },
    { id: 4, name: 'Maçonnerie', icon: <MdConstruction size={24} />, pros: 132, color: '#FFA07A' },
    { id: 5, name: 'Nettoyage', icon: <MdCleaningServices size={24} />, pros: 87, color: '#98D8C8' },
    { id: 6, name: 'Autres', icon: <MdOutlineHandyman size={24} />, pros: 156, color: '#D4A5A5' }
  ];

  const testimonials = [
    { id: 1, name: 'Martine .', rating: 5, text: 'Le plombier était ponctuel et professionnel. Problème résolu en 30 minutes !', date: '15/03/2023', avatar: 'ME' },
    { id: 2, name: 'Pierre .', rating: 5, text: 'Service électrique rapide et tarif très raisonnable. Je recommande vivement.', date: '22/04/2023', avatar: 'PD' },
    { id: 3, name: 'Sophie .', rating: 4, text: 'Peintre minutieux qui a respecté nos demandes spécifiques. Travail de qualité.', date: '05/05/2023', avatar: 'SL' }
  ];

  const popularSearches = ['Plombier ', 'Électricien urgent', 'Peintre appartement', 'Nettoyage après travaux'];

  return (
    <div className="app">
      <Header />
      
      {/* Hero Section avec Recherche Avancée */}
      <section className="hero" style={{ marginTop: '80px' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-text">
            <h1>Trouvez le professionel parfait pour chaque projet</h1>
            <p className="subtitle">Connectez-vous avec plus de 1000 professionnels vérifiés près de chez vous</p>
          </div>
          
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <div className="search-box">
              <div className="search-input with-icon">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Plombier, électricien, peintre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              <div className="search-input with-icon">
                <FiMapPin className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Où ? (ville, code postal...)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="btn-primary with-icon">
                <FiSearch /> Trouver un pro
              </button>
            </div>

            <div className="popular-searches">
              <span>Recherches populaires :</span>
              {popularSearches.map((search, index) => (
                <a href="#" key={index}>{search}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Services Premium */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-header">
            <h2>Services Professionnels</h2>
            <p className="section-subtitle">Choisissez parmi nos catégories spécialisées</p>
          </div>
          
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard 
                key={service.id}
                icon={service.icon}
                title={service.name}
                count={`${service.pros} artisans`}
                color={service.color}
                active={selectedService === service.name.toLowerCase()}
                onClick={() => setSelectedService(service.name.toLowerCase())}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Fonctionnement */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Comment ça marche ?</h2>
            <p className="section-subtitle">Trouvez un artisan en 3 étapes simples</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Décrivez votre besoin</h3>
                <p>Remplissez notre formulaire simple ou appelez-nous</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Recevez des devis</h3>
                <p>Plusieurs artisans vous contactent avec leurs propositions</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Choisissez votre pro</h3>
                <p>Sélectionnez le professionnel qui correspond à vos critères</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="section benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Pourquoi choisir notre plateforme ?</h2>
            <p className="section-subtitle">La qualité et la confiance avant tout</p>
          </div>
          
          <div className="benefits-grid">
            <BenefitCard 
              icon={<FiCheckCircle size={32} />}
              title="Profils vérifiés"
              description="Tous nos artisans sont certifiés et leurs qualifications vérifiées"
            />
            <BenefitCard 
              icon={<FiClock size={32} />}
              title="Disponibilité"
              description="Réservation en ligne avec confirmation instantanée"
            />
            <BenefitCard 
              icon={<FiMapPin size={32} />}
              title="Géolocalisation"
              description="Trouvez les artisans les plus proches de vous"
            />
            <BenefitCard 
              icon={<FiStar size={32} />}
              title="Avis vérifiés"
              description="Notes et commentaires authentiques"
            />
            <BenefitCard 
              icon={<FiCalendar size={32} />}
              title="RDV en ligne"
              description="Planifiez votre intervention en quelques clics"
            />
            <BenefitCard 
              icon={<FiFilter size={32} />}
              title="Filtres avancés"
              description="Trouvez l'artisan parfait selon vos critères"
            />
          </div>
        </div>
      </section>

      {/* Section Témoignages Premium */}
      <section id="testimonials" className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Ils nous ont fait confiance</h2>
            <p className="section-subtitle">Ce que nos clients disent de nous</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <TestimonialCard 
                key={testimonial.id}
                name={testimonial.name}
                rating={testimonial.rating}
                text={testimonial.text}
                date={testimonial.date}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Premium */}
      <section className="cta-premium">
        <div className="container">
          <div className="cta-content">
            <h3>Prêt à trouver votre professionel ?</h3>
            <p>Inscrivez-vous pour bénéficier de nos services premium</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large with-icon">
                Trouver un professionel <FiChevronRight />
              </button>
              <button className="btn-outline btn-large">
                Devenir professionel partenaire
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

// Composant Carte de Service
function ServiceCard({ icon, title, count, color, active, onClick }) {
  return (
    <div 
      className={`service-card ${active ? 'active' : ''}`} 
      onClick={onClick}
      style={{ '--card-color': color }}
    >
      <div className="service-icon" style={{ color: color }}>{icon}</div>
      <h3>{title}</h3>
      <p className="service-count">{count}</p>
      <div className="service-hover-effect"></div>
    </div>
  );
}

// Composant Avantage
function BenefitCard({ icon, title, description }) {
  return (
    <div className="benefit-card">
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Composant Témoignage
function TestimonialCard({ name, rating, text, date, avatar }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-avatar">{avatar}</div>
        <div className="testimonial-author">
          <h4>{name}</h4>
          <div className="testimonial-rating">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < rating ? 'filled' : ''} />
            ))}
          </div>
        </div>
      </div>
      <p className="testimonial-text">"{text}"</p>
      <div className="testimonial-date">
        <FiCalendar /> {date}
      </div>
    </div>
  );
}

export default Home;