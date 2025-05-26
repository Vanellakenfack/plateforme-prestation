import React, { useState } from 'react';
import '../../../assets/css/dashbordc.css'
import { 
  FiHome, FiCalendar, FiMessageSquare, FiStar, 
  FiHeart, FiUser, FiSettings, FiLogOut,
  FiDollarSign, FiClock, FiCheckCircle, FiBell
} from 'react-icons/fi';


const ClientDashboard = () => {
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Données simulées
  const stats = {
    totalSpent: 1245,
    averageRating: 4.5,
    bookingsCount: 12,
    favoritesCount: 5,
    unreadMessages: 3
  };

  const upcomingBookings = [
    { id: 1, service: "Plomberie", professional: "Jean Dupont", date: "15/06/2023", time: "10:00 - 12:00", price: 89 },
    { id: 2, service: "Électricité", professional: "Marie Lambert", date: "18/06/2023", time: "14:00 - 16:00", price: 120 }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar stylisée */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <h2 className="brand">
              <span className="text-primary">Pro</span>Services
            </h2>
          )}
          <button 
            className="toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '>' : '<'}
          </button>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <FiHome className="icon" />
            {!sidebarCollapsed && <span>Tableau de bord</span>}
          </button>
          
          <button 
            className={`menu-item ${activeMenu === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('bookings')}
          >
            <FiCalendar className="icon" />
            {!sidebarCollapsed && <span>Réservations</span>}
          </button>
          
          <button 
            className={`menu-item ${activeMenu === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveMenu('messages')}
          >
            <div className="position-relative">
              <FiMessageSquare className="icon" />
              {stats.unreadMessages > 0 && (
                <span className="notification-badge">{stats.unreadMessages}</span>
              )}
            </div>
            {!sidebarCollapsed && <span>Messages</span>}
          </button>
          
          <button 
            className={`menu-item ${activeMenu === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveMenu('favorites')}
          >
            <FiHeart className="icon" />
            {!sidebarCollapsed && <span>Favoris</span>}
          </button>
          
          <button 
            className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveMenu('profile')}
          >
            <FiUser className="icon" />
            {!sidebarCollapsed && <span>Profil</span>}
          </button>
          
          <div className="menu-divider"></div>
          
          <button className="menu-item">
            <FiSettings className="icon" />
            {!sidebarCollapsed && <span>Paramètres</span>}
          </button>
          
          <button className="menu-item logout">
            <FiLogOut className="icon" />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
        
        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Profile" 
                className="profile-img"
              />
              <div className="user-info">
                <h4>Marie Durand</h4>
                <p>Client depuis 2022</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Tableau de Bord</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <FiBell className="icon" />
              <span className="notification-dot"></span>
            </button>
            <div className="user-dropdown">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="User" 
                className="user-avatar"
              />
            </div>
          </div>
        </header>

        <div className="content">
          {/* Cartes de statistiques */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon bg-primary-light">
                <FiDollarSign className="text-primary" />
              </div>
              <div className="stat-info">
                <h3>{stats.totalSpent}€</h3>
                <p>Dépenses totales</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon bg-warning-light">
                <FiStar className="text-warning" />
              </div>
              <div className="stat-info">
                <h3>{stats.averageRating}/5</h3>
                <p>Note moyenne</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon bg-success-light">
                <FiCalendar className="text-success" />
              </div>
              <div className="stat-info">
                <h3>{stats.bookingsCount}</h3>
                <p>Réservations</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon bg-danger-light">
                <FiHeart className="text-danger" />
              </div>
              <div className="stat-info">
                <h3>{stats.favoritesCount}</h3>
                <p>Favoris</p>
              </div>
            </div>
          </div>

          {/* Réservations à venir */}
          <div className="section-card">
            <div className="section-header">
              <h2>Réservations à venir</h2>
              <button className="btn-view-all">Voir tout</button>
            </div>
            
            {upcomingBookings.length === 0 ? (
              <div className="empty-state">
                <FiCalendar className="empty-icon" />
                <p>Aucune réservation à venir</p>
              </div>
            ) : (
              <div className="bookings-list">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <h3>{booking.service}</h3>
                      <p>Avec {booking.professional}</p>
                      <div className="booking-meta">
                        <span><FiCalendar /> {booking.date}</span>
                        <span><FiClock /> {booking.time}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <span className="booking-price">{booking.price}€</span>
                      <button className="btn-details">Détails</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages et favoris */}
          <div className="dual-section">
            <div className="section-card messages-section">
              <div className="section-header">
                <h2>Messages</h2>
                <span className="unread-count">{stats.unreadMessages} non lus</span>
              </div>
              <div className="messages-preview">
                <div className="message-item unread">
                  <FiMessageSquare className="message-icon" />
                  <div className="message-content">
                    <h3>Jean Dupont</h3>
                    <p>Je confirme notre rendez-vous demain...</p>
                  </div>
                  <span className="message-time">10:30</span>
                </div>
                <div className="message-item">
                  <FiMessageSquare className="message-icon" />
                  <div className="message-content">
                    <h3>Marie Lambert</h3>
                    <p>Avez-vous reçu le devis que je...</p>
                  </div>
                  <span className="message-time">Hier</span>
                </div>
              </div>
              <button className="btn-view-messages">Voir tous les messages</button>
            </div>
            
            <div className="section-card favorites-section">
              <div className="section-header">
                <h2>Professionnels favoris</h2>
              </div>
              <div className="favorites-grid">
                <div className="favorite-item">
                  <img 
                    src="https://randomuser.me/api/portraits/men/42.jpg" 
                    alt="Jean Dupont" 
                    className="favorite-img"
                  />
                  <h3>Jean Dupont</h3>
                  <p>Plombier</p>
                  <div className="favorite-rating">
                    <FiStar className="star-icon" />
                    <span>4.8/5</span>
                  </div>
                </div>
                <div className="favorite-item">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Marie Lambert" 
                    className="favorite-img"
                  />
                  <h3>Marie Lambert</h3>
                  <p>Électricienne</p>
                  <div className="favorite-rating">
                    <FiStar className="star-icon" />
                    <span>4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;