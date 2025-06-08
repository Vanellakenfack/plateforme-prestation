import React, { useState, useEffect } from 'react';
import OwnerSidebar from './OwnerSidebar';
import { 
  FiHome, FiDollarSign, FiCalendar, FiMessageSquare, 
  FiUser, FiSettings, FiLogOut, FiStar, FiClock,
  FiAlertCircle, FiCheckCircle, FiTrendingUp, FiMenu
} from 'react-icons/fi';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Détection de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Données simulées
  const stats = {
    revenue: 2450,
    bookings: 18,
    rating: 4.7,
    pendingQuotes: 3,
    completedJobs: 42
  };

  const upcomingBookings = [
    { id: 1, client: "Marie Durand", service: "Plomberie", date: "15/06/2023", time: "10:00-12:00", price: 89 },
    { id: 2, client: "Pierre Martin", service: "Électricité", date: "16/06/2023", time: "14:00-16:00", price: 120 },
    { id: 3, client: "Sophie Leroy", service: "Peinture", date: "17/06/2023", time: "09:00-11:00", price: 150 }
  ];

  const pendingQuotes = [
    { id: 1, client: "Jean Dupont", service: "Jardinage", requested: "12/06/2023", budget: "200-300€" },
    { id: 2, client: "Lucie Bernard", service: "Menuiserie", requested: "13/06/2023", budget: "150-250€" }
  ];

  const recentReviews = [
    { id: 1, client: "Marie Durand", rating: 5, comment: "Excellent travail, très professionnel !", date: "10/06/2023" },
    { id: 2, client: "Pierre Martin", rating: 4, comment: "Bon service mais un peu en retard", date: "08/06/2023" }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar 
        key={i} 
        className={i < rating ? 'text-warning' : 'text-secondary'} 
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      <OwnerSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div 
        className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          marginLeft: isMobile ? 0 : sidebarOpen ? '250px' : '70px'
        }}
      >
        {/* Header */}
        <header className="dashboard-header">
          <div className="d-flex align-items-center">
            {isMobile && (
              <button 
                className="btn btn-sm me-3"
                onClick={toggleSidebar}
              >
                <FiMenu />
              </button>
            )}
            <h4 className="mb-0 fw-semibold">
              {activeTab === 'overview' && 'Tableau de Bord'}
              {activeTab === 'bookings' && 'Gestion des Réservations'}
              {activeTab === 'messages' && 'Messagerie'}
              {activeTab === 'services' && 'Mes Services'}
            </h4>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <FiAlertCircle className="fs-5 text-secondary" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">2</span>
            </div>
            <div className="d-flex align-items-center">
              <img 
                src="https://randomuser.me/api/portraits/men/42.jpg" 
                alt="Profile" 
                className="rounded-circle me-2"
                style={{width: '32px', height: '32px', objectFit: 'cover'}}
              />
              <span className="fw-medium d-none d-sm-inline">Jean D.</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card border-primary">
                  <div className="stat-icon bg-primary">
                    <FiDollarSign />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Revenus ce mois</p>
                    <h4 className="stat-value">{stats.revenue}€</h4>
                  </div>
                </div>
                
                <div className="stat-card border-success">
                  <div className="stat-icon bg-success">
                    <FiCheckCircle />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Prestations terminées</p>
                    <h4 className="stat-value">{stats.completedJobs}</h4>
                  </div>
                </div>
                
                <div className="stat-card border-warning">
                  <div className="stat-icon bg-warning">
                    <FiStar />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Note moyenne</p>
                    <div className="d-flex align-items-center">
                      <h4 className="stat-value me-2">{stats.rating}/5</h4>
                      <div className="star-rating">
                        {renderStars(Math.floor(stats.rating))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card border-danger">
                  <div className="stat-icon bg-danger">
                    <FiAlertCircle />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Devis en attente</p>
                    <h4 className="stat-value">{stats.pendingQuotes}</h4>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>Réservations à venir</h5>
                  <button className="btn-link">Voir tout</button>
                </div>
                <div className="card-body">
                  <div className="booking-list">
                    {upcomingBookings.map(booking => (
                      <div key={booking.id} className="booking-item">
                        <div className="booking-info">
                          <h6>{booking.service}</h6>
                          <small>{booking.client}</small>
                        </div>
                        <span className="booking-price">
                          {booking.price}€
                        </span>
                        <div className="booking-time">
                          <FiClock />
                          {booking.date} • {booking.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quotes and Reviews */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="dashboard-card h-100">
                    <div className="card-header">
                      <h5>Demandes de devis</h5>
                      <button className="btn-link">Voir tout</button>
                    </div>
                    <div className="card-body">
                      <div className="quote-list">
                        {pendingQuotes.map(quote => (
                          <div key={quote.id} className="quote-item">
                            <div className="quote-info">
                              <h6>{quote.service}</h6>
                              <small>{quote.client}</small>
                            </div>
                            <span className="quote-budget">
                              {quote.budget}
                            </span>
                            <div className="quote-actions">
                              <button className="btn-primary">
                                Accepter
                              </button>
                              <button className="btn-outline">
                                Voir détails
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="dashboard-card h-100">
                    <div className="card-header">
                      <h5>Derniers avis</h5>
                      <button className="btn-link">Voir tout</button>
                    </div>
                    <div className="card-body">
                      <div className="review-list">
                        {recentReviews.map(review => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <h6>{review.client}</h6>
                              <div className="stars">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="review-comment">"{review.comment}"</p>
                            <small className="review-date">{review.date}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="dashboard-card">
              <div className="card-body">
                <h5 className="card-title">Toutes vos réservations</h5>
                <p className="text-muted">Interface complète de gestion des réservations</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="dashboard-card">
              <div className="card-body">
                <h5 className="card-title">Messagerie</h5>
                <p className="text-muted">Interface de discussion avec les clients</p>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="dashboard-card">
              <div className="card-body">
                <h5 className="card-title">Gestion de vos services</h5>
                <p className="text-muted">Interface pour modifier vos offres de services</p>
              </div>
            </div>
          )}
        </main>
      </div>

     
    </div>
  );
};

export default Dashboard;