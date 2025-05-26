import React, { useState } from 'react';
import { 
  FiHome, FiDollarSign, FiCalendar, FiMessageSquare, 
  FiUser, FiSettings, FiLogOut, FiStar, FiClock,
  FiAlertCircle, FiCheckCircle, FiTrendingUp, FiMenu
} from 'react-icons/fi';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      />
    ));
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar Bootstrap */}
      <div className={`bg-white shadow-sm ${sidebarOpen ? 'w-25' : 'w-auto'} transition-all`}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          {sidebarOpen ? (
            <h5 className="mb-0 text-primary fw-bold">ProServices</h5>
          ) : (
            <div className="rounded-circle bg-primary" style={{width: '30px', height: '30px'}}></div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-sm btn-outline-secondary"
          >
            <FiMenu />
          </button>
        </div>
        
        <nav className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`nav-link d-flex align-items-center ${activeTab === 'overview' ? 'active bg-primary text-white' : 'text-dark'}`}
              >
                <FiHome className="me-2" />
                {sidebarOpen && <span>Tableau de bord</span>}
              </button>
            </li>
            
            <li className="nav-item mb-2">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`nav-link d-flex align-items-center ${activeTab === 'bookings' ? 'active bg-primary text-white' : 'text-dark'}`}
              >
                <FiCalendar className="me-2" />
                {sidebarOpen && <span>Réservations</span>}
              </button>
            </li>
            
            <li className="nav-item mb-2">
              <button 
                onClick={() => setActiveTab('messages')}
                className={`nav-link d-flex align-items-center ${activeTab === 'messages' ? 'active bg-primary text-white' : 'text-dark'}`}
              >
                <FiMessageSquare className="me-2" />
                {sidebarOpen && (
                  <>
                    <span>Messages</span>
                    <span className="badge bg-danger ms-auto">3</span>
                  </>
                )}
              </button>
            </li>
            
            <li className="nav-item mb-2">
              <button 
                onClick={() => setActiveTab('services')}
                className={`nav-link d-flex align-items-center ${activeTab === 'services' ? 'active bg-primary text-white' : 'text-dark'}`}
              >
                <FiSettings className="me-2" />
                {sidebarOpen && <span>Mes Services</span>}
              </button>
            </li>
          </ul>
          
          <div className="mt-4 pt-3 border-top">
            <button className="nav-link d-flex align-items-center text-dark">
              <FiUser className="me-2" />
              {sidebarOpen && <span>Mon Profil</span>}
            </button>
            
            <button className="nav-link d-flex align-items-center text-danger mt-2">
              <FiLogOut className="me-2" />
              {sidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-semibold">
            {activeTab === 'overview' && 'Tableau de Bord'}
            {activeTab === 'bookings' && 'Gestion des Réservations'}
            {activeTab === 'messages' && 'Messagerie'}
            {activeTab === 'services' && 'Mes Services'}
          </h4>
          
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
              {sidebarOpen && <span className="fw-medium">Jean D.</span>}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="row mb-4 g-4">
                <div className="col-md-6 col-lg-3">
                  <div className="card border-start border-primary border-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                          <FiDollarSign className="text-primary fs-4" />
                        </div>
                        <div>
                          <p className="text-muted mb-0">Revenus ce mois</p>
                          <h4 className="mb-0 fw-bold">{stats.revenue}€</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                  <div className="card border-start border-success border-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                          <FiCheckCircle className="text-success fs-4" />
                        </div>
                        <div>
                          <p className="text-muted mb-0">Prestations terminées</p>
                          <h4 className="mb-0 fw-bold">{stats.completedJobs}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                  <div className="card border-start border-warning border-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                          <FiStar className="text-warning fs-4" />
                        </div>
                        <div>
                          <p className="text-muted mb-0">Note moyenne</p>
                          <div className="d-flex align-items-center">
                            <h4 className="mb-0 fw-bold me-2">{stats.rating}/5</h4>
                            <div className="d-flex">
                              {renderStars(Math.floor(stats.rating))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                  <div className="card border-start border-danger border-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                          <FiAlertCircle className="text-danger fs-4" />
                        </div>
                        <div>
                          <p className="text-muted mb-0">Devis en attente</p>
                          <h4 className="mb-0 fw-bold">{stats.pendingQuotes}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="card mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Réservations à venir</h5>
                  <button className="btn btn-sm btn-link text-primary">Voir tout</button>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {upcomingBookings.map(booking => (
                      <div key={booking.id} className="list-group-item list-group-item-action">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1 fw-semibold">{booking.service}</h6>
                            <small className="text-muted">{booking.client}</small>
                          </div>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {booking.price}€
                          </span>
                        </div>
                        <div className="mt-2 d-flex align-items-center text-muted small">
                          <FiClock className="me-1" />
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
                  <div className="card h-100">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Demandes de devis</h5>
                      <button className="btn btn-sm btn-link text-primary">Voir tout</button>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        {pendingQuotes.map(quote => (
                          <div key={quote.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1 fw-semibold">{quote.service}</h6>
                                <small className="text-muted">{quote.client}</small>
                              </div>
                              <span className="badge bg-warning bg-opacity-10 text-warning">
                                {quote.budget}
                              </span>
                            </div>
                            <div className="mt-3 d-flex gap-2">
                              <button className="btn btn-sm btn-primary">
                                Accepter
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
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
                  <div className="card h-100">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Derniers avis</h5>
                      <button className="btn btn-sm btn-link text-primary">Voir tout</button>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        {recentReviews.map(review => (
                          <div key={review.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0 fw-semibold">{review.client}</h6>
                              <div className="d-flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-muted small mb-2">"{review.comment}"</p>
                            <small className="text-muted">{review.date}</small>
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
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Toutes vos réservations</h5>
                <p className="text-muted">Interface complète de gestion des réservations</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Messagerie</h5>
                <p className="text-muted">Interface de discussion avec les clients</p>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="card">
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