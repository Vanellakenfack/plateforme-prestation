import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiAlertTriangle, 
  FiActivity, 
  FiHome,
  FiShield,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiTool,
  FiCreditCard,
  FiDownload,
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Pusher from 'pusher-js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`admin-sidebar bg-white shadow-sm ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header p-3 border-bottom">
        <h5 className="mb-0 text-primary fw-bold">Admin Panel</h5>
      </div>
      
      <nav className="sidebar-nav p-3">
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink to="/admin" end className="nav-link d-flex align-items-center rounded">
              <FiHome className="me-2" />
              <span>Tableau de bord</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/users" className="nav-link d-flex align-items-center rounded">
              <FiUsers className="me-2" />
              <span>Utilisateurs</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/providers" className="nav-link d-flex align-items-center rounded">
              <FiUserCheck className="me-2" />
              <span>Prestataires</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/services" className="nav-link d-flex align-items-center rounded">
              <FiTool className="me-2" />
              <span>Services</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/subscriptions" className="nav-link d-flex align-items-center rounded">
              <FiCreditCard className="me-2" />
              <span>Abonnements</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/transactions" className="nav-link d-flex align-items-center rounded">
              <FiDollarSign className="me-2" />
              <span>Transactions</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/reports" className="nav-link d-flex align-items-center rounded">
              <FiPieChart className="me-2" />
              <span>Rapports</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/alerts" className="nav-link d-flex align-items-center rounded">
              <FiAlertTriangle className="me-2" />
              <span>Alertes</span>
              <span className="badge bg-danger ms-auto">5</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink to="/admin/moderation" className="nav-link d-flex align-items-center rounded">
              <FiShield className="me-2" />
              <span>Modération</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer mt-auto pt-4 border-top">
          <button className="nav-link d-flex align-items-center rounded text-danger">
            <FiLogOut className="me-2" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    activeSubscriptions: 0,
    transactions: 0,
    revenue: 0,
    alerts: 0,
    disputes: 0,
    services: 0,
    bookings: 0
  });
  const [alerts, setAlerts] = useState([]);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      // Vérification du rôle admin
      const role = 'admin'; // En production, récupérer depuis l'API
      setUserRole(role);
      
      // Chargement des données
      setTimeout(() => {
        setStats({
          users: 1245,
          providers: 342,
          activeSubscriptions: 278,
          transactions: 894,
          revenue: 56890,
          alerts: 12,
          disputes: 5,
          services: 1567,
          bookings: 2301
        });
        
        setAlerts([
          { id: 1, type: 'signalement', message: 'Signalement sur le profil de Jean D.', date: '2023-06-15', urgent: true },
          { id: 2, type: 'paiement', message: 'Paiement en attente depuis 5 jours', date: '2023-06-14', urgent: false },
          { id: 3, type: 'contenu', message: 'Service signalé comme inapproprié', date: '2023-06-13', urgent: true }
        ]);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
    
    // Configuration des notifications en temps réel
    const pusher = new Pusher('your_app_key', {
      cluster: 'eu',
      encrypted: true
    });
    
    const channel = pusher.subscribe('admin-channel');
    channel.bind('new-alert', (data) => {
      setAlerts(prev => [data, ...prev.slice(0, 4)]);
      setStats(prev => ({...prev, alerts: prev.alerts + 1}));
    });

    return () => {
      pusher.unsubscribe('admin-channel');
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, []);

  const transactionData = useMemo(() => ({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Transactions',
      data: [120, 190, 150, 210, 180, 240],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }), []);

  const userData = useMemo(() => ({
    labels: ['Clients', 'Prestataires', 'Admins'],
    datasets: [{
      data: [stats.users - stats.providers - 5, stats.providers, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  }), [stats.users, stats.providers]);

  const subscriptionData = useMemo(() => ({
    labels: ['Gratuit', 'Basique', 'Pro', 'Premium'],
    datasets: [{
      label: 'Répartition abonnements',
      data: [64, 120, 95, 63],
      backgroundColor: [
        'rgba(99, 102, 241, 0.5)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.5)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)'
      ],
      borderWidth: 1
    }]
  }), []);

  const handleExport = (type) => {
    console.log(`Exporting ${type} data...`);
    // En production, faire une requête API pour générer le fichier
    alert(`Export des données ${type} en cours...`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="alert alert-danger">Accès refusé. Vous n'avez pas les droits administrateur.</div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-grow-1 admin-content" style={{ 
        marginLeft: sidebarOpen ? '250px' : '80px',
        transition: 'margin-left 0.3s ease',
        padding: '20px'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <FiActivity className="me-2" />
            Tableau de Bord Administrateur
          </h2>
          <button 
            className="btn btn-outline-secondary d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="row mb-4 g-3">
          {[
            { icon: <FiUsers />, title: 'Utilisateurs', value: stats.users, color: 'primary', extra: `${stats.providers} prestataires` },
            { icon: <FiUserCheck />, title: 'Abonnements actifs', value: stats.activeSubscriptions, color: 'info', extra: `${Math.round((stats.activeSubscriptions/stats.providers)*100)}% des prestataires` },
            { icon: <FiDollarSign />, title: 'Transactions', value: stats.transactions, color: 'success', extra: `$${stats.revenue.toLocaleString()} CA` },
            { icon: <FiTool />, title: 'Services', value: stats.services, color: 'secondary' },
            { icon: <FiCalendar />, title: 'Réservations', value: stats.bookings, color: 'warning', extra: '+15% ce mois' },
            { icon: <FiAlertTriangle />, title: 'Alertes', value: stats.alerts, color: 'danger', extra: `${stats.disputes} litiges` }
          ].map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4 col-xl-2">
              <div className={`card h-100 border-start border-${card.color} border-4`}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className={`bg-${card.color} bg-opacity-10 p-3 rounded me-3`}>
                      {React.cloneElement(card.icon, { className: `text-${card.color} fs-4` })}
                    </div>
                    <div>
                      <h5 className="card-title text-muted mb-1">{card.title}</h5>
                      <h2 className="mb-0">{card.value}</h2>
                      {card.extra && <small className={`text-${card.color}`}>{card.extra}</small>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Activité des transactions</h5>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleExport('transactions')}
                >
                  <FiDownload className="me-1" /> Exporter
                </button>
              </div>
              <div className="card-body">
                <Bar 
                  data={transactionData} 
                  options={{ 
                    responsive: true, 
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `$${context.raw.toLocaleString()}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => `$${value}`
                        }
                      }
                    }
                  }} 
                  ref={barChartRef}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Répartition des utilisateurs</h5>
              </div>
              <div className="card-body">
                <Pie 
                  data={userData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} 
                  ref={pieChartRef}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième ligne de graphiques */}
        <div className="row g-3 mb-4">
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Répartition des abonnements</h5>
              </div>
              <div className="card-body">
                <Pie 
                  data={subscriptionData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Alertes Récentes</h5>
                <div>
                  <button 
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => handleExport('alerts')}
                  >
                    <FiDownload className="me-1" /> Exporter
                  </button>
                  <button className="btn btn-sm btn-outline-primary">Voir tout</button>
                </div>
              </div>
              <div className="list-group list-group-flush">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`list-group-item list-group-item-action ${alert.urgent ? 'list-group-item-danger' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{alert.message}</h6>
                        <small className="text-muted">
                          <FiCalendar className="me-1" />
                          {new Date(alert.date).toLocaleDateString()}
                        </small>
                      </div>
                      <span className={`badge ${alert.urgent ? 'bg-danger' : 'bg-secondary'}`}>
                        {alert.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-sidebar {
          width: 250px;
          height: 100vh;
          position: fixed;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .admin-sidebar.closed {
          width: 80px;
        }
        
        .admin-sidebar.closed .nav-link span,
        .admin-sidebar.closed .badge {
          display: none;
        }
        
        .admin-sidebar.closed .sidebar-header h5 {
          display: none;
        }
        
        .admin-content {
          transition: margin-left 0.3s ease;
        }
        
        @media (max-width: 992px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .admin-content {
            margin-left: 0 !important;
          }
        }
        
        .card {
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .list-group-item {
          padding: 1rem;
          border-left: 0;
          border-right: 0;
        }
        
        .list-group-item:first-child {
          border-top: 0;
        }
        
        .list-group-item:last-child {
          border-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;