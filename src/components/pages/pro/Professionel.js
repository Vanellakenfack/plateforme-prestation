import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaRegStar, FaMapMarkerAlt, FaPhone, FaWhatsapp, 
  FaCalendarAlt, FaMoneyBillWave, FaShieldAlt, FaImages,
  FaChevronLeft, FaChevronRight, FaBookmark, FaShare
} from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../assets/css/pro.css';
import Header from '../../common/Header';
const Professionel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [availability, setAvailability] = useState([]);

  // Données du prestataire (simulées)
  const professional = {
    name: "Jean Kamga",
    profession: "Maçon Expert",
    rating: 4.7,
    reviews: 128,
    location: "Douala, Bonanjo",
    price: "15,000 FCFA/jour",
    verified: true,
    experience: "12 ans",
    description: "Spécialiste en construction moderne et rénovation de bâtiments. Travail soigné et respect des délais.",
    images: [
      "/img/project1.jpg",
      "/img/project2.jpg",
      "/img/project3.jpg"
    ],
    services: [
      "Fondations",
      "Murs en parpaing",
      "Carrelage",
      "Enduit"
    ],
    certifications: [
      "Certifié CNPS",
      "Diplôme de maçonnerie"
    ]
  };

  // Générer des disponibilités
  useEffect(() => {
    const generateAvailability = () => {
      const slots = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        slots.push({
          date,
          available: Math.random() > 0.3,
          times: ['08:00', '10:00', '14:00'].filter(() => Math.random() > 0.4)
        });
      }
      
      setAvailability(slots);
    };

    generateAvailability();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === professional.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? professional.images.length - 1 : prev - 1
    );
  };

  return (
     
    <div className="professional-page bg-light min-vh-100">
     
      {/* Header avec image de couverture */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="position-relative h-50 bg-dark overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={professional.images[currentImageIndex]}
            alt="Projet professionnel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-100 h-100 object-fit-cover"
          />
        </AnimatePresence>

        <button 
          onClick={prevImage}
          className="position-absolute start-0 top-50 translate-middle-y bg-black bg-opacity-50 text-white p-2 rounded-circle border-0 ms-3 hover-bg-opacity-70"
        >
          <FaChevronLeft size={20} />
        </button>
        <button 
          onClick={nextImage}
          className="position-absolute end-0 top-50 translate-middle-y bg-black bg-opacity-50 text-white p-2 rounded-circle border-0 me-3 hover-bg-opacity-70"
        >
          <FaChevronRight size={20} />
        </button>

        <div className="position-absolute bottom-0 start-0 d-flex gap-2 p-3">
          {professional.images.map((_, index) => (
            <motion.div
              key={index}
              animate={{ 
                width: index === currentImageIndex ? '24px' : '8px',
                backgroundColor: index === currentImageIndex ? '#0d6efd' : 'rgba(255,255,255,0.5)'
              }}
              className="h-2 rounded-pill cursor-pointer"
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Section principale */}
      <div className="container max-w-6xl px-4 py-4 mt-n5 position-relative z-3">
        {/* Carte profil */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3 shadow-lg p-4 mb-4"
        >
          <div className="d-flex flex-column flex-md-row">
            {/* Photo de profil */}
            <div className="position-relative mt-n5 mb-3 mb-md-0 me-md-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="rounded-circle border border-4 border-white overflow-hidden shadow"
                style={{ width: '128px', height: '128px' }}
              >
                <img 
                  src="/img/profile.jpg" 
                  alt={professional.name}
                  className="w-100 h-100 object-fit-cover"
                />
              </motion.div>
              {professional.verified && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="position-absolute bottom-0 end-0 bg-primary text-white p-1 rounded-circle"
                >
                  <RiVerifiedBadgeFill size={20} />
                </motion.div>
              )}
            </div>

            {/* Informations */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="h2 fw-bold text-dark mb-1">{professional.name}</h1>
                  <p className="h5 text-secondary">{professional.profession}</p>
                </div>
                <div className="d-flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`btn p-2 rounded-circle ${isBookmarked ? 'text-warning' : 'text-muted'}`}
                  >
                    <FaBookmark size={24} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn p-2 rounded-circle text-secondary"
                  >
                    <FaShare size={22} />
                  </motion.button>
                </div>
              </div>

              <div className="d-flex align-items-center my-2">
                <div className="d-flex text-warning me-2">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(professional.rating) ? 
                    <FaStar key={i} /> : 
                    <FaRegStar key={i} />
                  ))}
                </div>
                <span className="text-dark fw-medium">
                  {professional.rating} ({professional.reviews} avis)
                </span>
              </div>

              <div className="d-flex flex-wrap gap-3 my-3">
                <div className="d-flex align-items-center text-dark">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  {professional.location}
                </div>
                <div className="d-flex align-items-center text-dark">
                  <FaMoneyBillWave className="me-2 text-success" />
                  {professional.price}
                </div>
                <div className="d-flex align-items-center text-dark">
                  <FaShieldAlt className="me-2 text-info" />
                  {professional.experience} d'expérience
                </div>
              </div>

              <p className="mt-3 text-secondary">{professional.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation par onglets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="d-flex border-bottom mb-4"
        >
          {['about', 'services', 'portfolio', 'reviews', 'availability'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn px-4 py-3 fw-medium position-relative ${activeTab === tab ? 'text-primary' : 'text-secondary'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tabUnderline"
                  className="position-absolute bottom-0 start-0 w-100 h-1 bg-primary"
                  initial={false}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Contenu des onglets */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3 shadow p-4 mb-4"
        >
          {activeTab === 'about' && (
            <div>
              <h2 className="h3 fw-bold mb-3 text-dark">À propos</h2>
              <p className="text-secondary mb-4">{professional.description}</p>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <h3 className="h5 fw-semibold mb-3 text-dark">Services proposés</h3>
                  <ul className="list-unstyled">
                    {professional.services.map((service, index) => (
                      <motion.li 
                        key={index}
                        whileHover={{ x: 5 }}
                        className="d-flex align-items-center text-dark mb-2"
                      >
                        <IoMdCheckmarkCircleOutline className="me-2 text-success" />
                        {service}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h3 className="h5 fw-semibold mb-3 text-dark">Certifications</h3>
                  <ul className="list-unstyled">
                    {professional.certifications.map((cert, index) => (
                      <motion.li 
                        key={index}
                        whileHover={{ x: 5 }}
                        className="d-flex align-items-center text-dark mb-2"
                      >
                        <IoMdCheckmarkCircleOutline className="me-2 text-primary" />
                        {cert}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div>
              <h2 className="h3 fw-bold mb-4 text-dark">Disponibilités</h2>
              <div className="row g-3">
                {availability.map((day, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`col-12 col-md p-3 rounded-2 text-center ${day.available ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light text-muted'}`}
                  >
                    <div className="fw-medium">
                      {day.date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="small mb-2">
                      {day.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                    {day.available ? (
                      <div className="d-grid gap-2">
                        {day.times.map((time, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary btn-sm py-1"
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="small">Indisponible</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Boutons d'action fixes */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed-bottom mb-3 d-flex justify-content-center"
        >
          <div className="bg-white rounded-pill shadow p-2 d-flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary px-4 py-3 rounded-pill d-flex align-items-center"
            >
              <FaPhone className="me-2" />
              Appeler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-success px-4 py-3 rounded-pill d-flex align-items-center"
            >
              <FaWhatsapp className="me-2" />
              WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-dark px-4 py-3 rounded-pill d-flex align-items-center"
            >
              <FaCalendarAlt className="me-2" />
              Réserver
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Professionel;