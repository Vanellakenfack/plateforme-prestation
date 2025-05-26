import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../assets/css/profil.css';
import { 
  FiStar, FiMapPin, FiCalendar, FiClock, 
  FiMessageSquare, FiCheckCircle, FiAward, FiMail, FiPhone 
} from 'react-icons/fi';
import { MdOutlineWork, MdEuroSymbol, MdVerified } from 'react-icons/md';
import Gallery from 'react-grid-gallery';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Données simulées - À remplacer par un appel API
  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true);
      try {
        // Simulation de chargement
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          id: 1,
          name: "Jean Dupont",
          profession: "Plombier Professionnel",
          rating: 4.8,
          reviews: 127,
          verified: true,
          experience: "10 ans",
          location: "Paris, France",
          about: "Plombier diplômé avec 10 ans d'expérience. Spécialisé dans la rénovation de salles de bain et la réparation de fuites complexes. Travail soigné et garantie sur toutes mes prestations.",
          services: [
            { name: "Réparation de fuite", price: 65, duration: "1-2h" },
            { name: "Installation sanitaire", price: 250, duration: "1 jour" },
            { name: "Rénovation salle de bain", price: 1500, duration: "3-5 jours" }
          ],
          photos: [
            { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", caption: "Travail de plomberie" },
            { src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea", thumbnail: "https://images.unsplash.com/photo-1600566752355-35792bedcfea", caption: "Salle de bain rénovée" }
          ],
          workingHours: [
            { day: "Lundi", hours: "08:00 - 18:00" },
            { day: "Mardi", hours: "08:00 - 18:00" },
            { day: "Mercredi", hours: "08:00 - 18:00" },
            { day: "Jeudi", hours: "08:00 - 18:00" },
            { day: "Vendredi", hours: "08:00 - 18:00" }
          ],
          certifications: [
            "CAP Plomberie",
            "Certification Gaz",
            "Diplôme de plombier-chauffagiste"
          ],
          contact: {
            phone: "+33 6 12 34 56 78",
            email: "jean.dupont@example.com"
          }
        };
        
        setProfessional(mockData);
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  // Simulation de récupération des créneaux disponibles
  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots([
        "09:00 - 10:00",
        "11:00 - 12:00",
        "14:00 - 15:00",
        "16:00 - 17:00"
      ]);
    }
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!professional) {
    return <div className="not-found">Professionnel non trouvé</div>;
  }

  return (
    <div className="professional-profile">
      {/* En-tête du profil */}
      <header className="profile-header">
        <div className="cover-photo"></div>
        <div className="profile-info">
          <div className="avatar-container">
            <img 
              src="https://randomuser.me/api/portraits/men/42.jpg" 
              alt={professional.name} 
              className="profile-avatar"
            />
            {professional.verified && (
              <MdVerified className="verified-badge" />
            )}
          </div>
          <div className="profile-meta">
            <h1>{professional.name}</h1>
            <p className="profession">
              <MdOutlineWork /> {professional.profession}
            </p>
            <div className="rating">
              <FiStar className="star-icon" />
              <span>{professional.rating}</span>
              <span className="reviews">({professional.reviews} avis)</span>
            </div>
            <div className="location">
              <FiMapPin /> {professional.location}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <nav className="profile-tabs">
        <button 
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          À propos
        </button>
        <button 
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          className={activeTab === 'portfolio' ? 'active' : ''}
          onClick={() => setActiveTab('portfolio')}
        >
          Réalisations
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Avis
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="profile-content">
        {/* Section À propos */}
        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-card">
              <h2>Présentation</h2>
              <p>{professional.about}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <FiAward className="detail-icon" />
                  <div>
                    <h3>Expérience</h3>
                    <p>{professional.experience}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FiCheckCircle className="detail-icon" />
                  <div>
                    <h3>Certifications</h3>
                    <ul className="certifications-list">
                      {professional.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FiClock className="detail-icon" />
                  <div>
                    <h3>Horaires</h3>
                    <ul className="hours-list">
                      {professional.workingHours.map((day, index) => (
                        <li key={index}>
                          <span>{day.day}</span>
                          <span>{day.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-card">
              <h2>Contact</h2>
              <div className="contact-methods">
                <a href={`tel:${professional.contact.phone}`} className="contact-button">
                  <FiPhone /> Appeler
                </a>
                <a href={`mailto:${professional.contact.email}`} className="contact-button">
                  <FiMail /> Email
                </a>
                <button className="contact-button primary">
                  <FiMessageSquare /> Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Services */}
        {activeTab === 'services' && (
          <div className="services-section">
            <h2>Services proposés</h2>
            <div className="services-grid">
              {professional.services.map((service, index) => (
                <div key={index} className="service-card">
                  <h3>{service.name}</h3>
                  <div className="service-meta">
                    <span className="price">
                      <MdEuroSymbol /> {service.price}€
                    </span>
                    <span className="duration">
                      <FiClock /> {service.duration}
                    </span>
                  </div>
                  <button className="book-button">Réserver</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="portfolio-section">
            <h2>Mes réalisations</h2>
            {professional.photos.length > 0 ? (
              <Gallery 
                images={professional.photos}
                enableImageSelection={false}
                rowHeight={200}
                margin={10}
              />
            ) : (
              <p className="no-portfolio">Aucune réalisation disponible pour le moment</p>
            )}
          </div>
        )}

        {/* Section Avis */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>Avis clients ({professional.reviews})</h2>
            <div className="reviews-list">
              {/* Exemple d'avis - À remplacer par des données réelles */}
              <div className="review-card">
                <div className="review-header">
                  <img 
                    src="https://randomuser.me/api/portraits/women/63.jpg" 
                    alt="Client" 
                    className="review-avatar"
                  />
                  <div>
                    <h3>Marie Lambert</h3>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={i < 4 ? "filled" : ""} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="review-text">
                  "Jean a fait un excellent travail de rénovation de ma salle de bain. Professionnel et minutieux, je recommande vivement ses services !"
                </p>
                <p className="review-date">15 mars 2023</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Widget de réservation fixe */}
      <aside className="booking-widget">
        <h3>Prendre rendez-vous</h3>
        <div className="date-picker">
          <label>
            <FiCalendar /> Date
          </label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        
        {selectedDate && (
          <div className="time-slots">
            <label>Créneaux disponibles</label>
            <div className="slot-grid">
              {availableSlots.map((slot, index) => (
                <button 
                  key={index} 
                  className="time-slot"
                  onClick={() => console.log(`Réservé: ${selectedDate} à ${slot}`)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button className="confirm-booking" disabled={!selectedDate}>
          Confirmer la réservation
        </button>
      </aside>
    </div>
  );
};

export default ProfessionalProfile;