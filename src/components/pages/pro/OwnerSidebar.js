import React, { useState } from 'react';
import '../../../assets/css/ownerside.css'
import { 
  FiHome, FiDollarSign, FiCalendar, FiMessageSquare, 
  FiUser, FiSettings, FiLogOut, FiMenu, FiBriefcase,
  FiUsers, FiFileText, FiPieChart
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

function OwnerSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Configuration des éléments de menu
    const menuItems = [
        { path: '/dashboard', icon: <FiHome />, label: 'Tableau de bord' },
        { path: '/services', icon: <FiBriefcase />, label: 'Mes Services' },
        { path: '/bookings', icon: <FiCalendar />, label: 'Réservations' },
        { path: '/clients', icon: <FiUsers />, label: 'Clients' },
        { path: '/messages', icon: <FiMessageSquare />, label: 'Messages', badge: 3 },
        { path: '/invoices', icon: <FiFileText />, label: 'Factures' },
        { path: '/reports', icon: <FiPieChart />, label: 'Rapports' },
        { path: '/earnings', icon: <FiDollarSign />, label: 'Revenus' },
        { path: '/settings', icon: <FiSettings />, label: 'Paramètres' }
    ];

    return (
        <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : 'closed'}`}>
            {/* Logo et bouton de toggle */}
            <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
                {sidebarOpen ? (
                    <h5 className="mb-0 text-primary fw-bold">ProServices</h5>
                ) : (
                    <div className="logo-icon bg-primary rounded-circle" style={{ width: '30px', height: '30px' }}></div>
                )}
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <FiMenu />
                </button>
            </div>

            {/* Menu de navigation */}
            <nav className="sidebar-nav p-3">
                <ul className="nav flex-column">
                    {menuItems.map((item) => (
                        <li className="nav-item mb-2" key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link d-flex align-items-center rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`}
                            >
                                <span className="icon-wrapper">{item.icon}</span>
                                {sidebarOpen && (
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

                {/* Section inférieure (profil et déconnexion) */}
                <div className="sidebar-footer mt-auto pt-4 border-top">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-link d-flex align-items-center rounded ${isActive ? 'active bg-light' : 'text-dark'}`}
                    >
                        <FiUser className="icon-wrapper" />
                        {sidebarOpen && <span className="ms-2">Mon Profil</span>}
                    </NavLink>

                    <button className="nav-link d-flex align-items-center rounded text-danger mt-2">
                        <FiLogOut className="icon-wrapper" />
                        {sidebarOpen && <span className="ms-2">Déconnexion</span>}
                    </button>
                </div>
            </nav>

            {/* Style intégré pour faciliter la réutilisation */}
            
        </div>
    );
}

export default OwnerSidebar;