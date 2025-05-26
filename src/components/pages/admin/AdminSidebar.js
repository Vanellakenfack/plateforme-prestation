import React from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiAlertTriangle,
  FiShield,
  FiFileText,
  FiPieChart,
  FiMessageSquare,
  FiLogOut
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  // Liens de navigation
  const navItems = [
    { path: '/admin', icon: <FiHome />, label: 'Tableau de bord' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Utilisateurs' },
    { path: '/admin/transactions', icon: <FiDollarSign />, label: 'Transactions' },
    { path: '/admin/reports', icon: <FiPieChart />, label: 'Rapports' },
    { path: '/admin/alerts', icon: <FiAlertTriangle />, label: 'Alertes', badge: 5 },
    { path: '/admin/moderation', icon: <FiShield />, label: 'Modération' },
    { path: '/admin/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Paramètres' }
  ];

  return (
    <div className={`admin-sidebar bg-white shadow-sm ${isOpen ? 'open' : 'closed'}`}>
      {/* Logo et bouton de toggle */}
      <div className="sidebar-header p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          {isOpen ? (
            <h5 className="mb-0 text-primary fw-bold">Admin Panel</h5>
          ) : (
            <div className="logo-icon bg-primary rounded-circle" style={{ width: '30px', height: '30px' }}></div>
          )}
          <button 
            className="btn btn-sm btn-outline-secondary d-none d-md-block"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="sidebar-nav p-3">
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                }
              >
                <span className="icon-wrapper">{item.icon}</span>
                {isOpen && (
                  <>
                    <span className="ms-2">{item.label}</span>
                    {item.badge && (
                      <span className="badge bg-danger ms-auto">{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Section déconnexion */}
        <div className="sidebar-footer mt-auto pt-4 border-top">
          <button className="nav-link d-flex align-items-center rounded text-danger">
            <FiLogOut className="icon-wrapper" />
            {isOpen && <span className="ms-2">Déconnexion</span>}
          </button>
        </div>
      </nav>

      {/* Styles CSS */}
      <style jsx>{`
        .admin-sidebar {
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .admin-sidebar.open {
          width: 250px;
        }
        
        .admin-sidebar.closed {
          width: 80px;
        }
        
        .icon-wrapper {
          width: 24px;
          display: inline-flex;
          justify-content: center;
        }
        
        .nav-link {
          padding: 0.75rem 1rem;
          transition: all 0.2s;
        }
        
        .nav-link:hover:not(.active) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
        }
        
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            transform: translateX(-100%);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
            box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;