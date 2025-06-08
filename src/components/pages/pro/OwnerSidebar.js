import React, { useState, useEffect } from 'react';
import '../../../assets/css/ownerside.css';
import { 
  FiHome, FiDollarSign, FiCalendar, FiMessageSquare, 
  FiUser, FiSettings, FiLogOut, FiMenu, FiBriefcase,
  FiUsers, FiFileText, FiPieChart
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

function OwnerSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Détection de la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
            if (window.innerWidth < 992) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize(); // Appel initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Configuration des éléments de menu
    const menuItems = [
        { path: '/dashboard', icon: <FiHome />, label: 'Tableau de bord' },
        { path: '/services', icon: <FiBriefcase />, label: 'Mes Services' },
        { path: '/bookings', icon: <FiCalendar />, label: 'Réservations' },
        { path: '/clients', icon: <FiUsers />, label: 'Clients' },
        { path: '/message', icon: <FiMessageSquare />, label: 'Messages', badge: 3 },
        { path: '/invoices', icon: <FiFileText />, label: 'Factures' },
        { path: '/reports', icon: <FiPieChart />, label: 'Rapports' },
        { path: '/earnings', icon: <FiDollarSign />, label: 'Revenus' },
        { path: '/settings', icon: <FiSettings />, label: 'Paramètres' }
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Overlay pour mobile */}
            {isMobile && sidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
                {/* Logo et bouton de toggle */}
                <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
                    {sidebarOpen ? (
                        <h5 className="mb-0 text-primary fw-bold">ProServices</h5>
                    ) : (
                        <div className="logo-icon bg-primary rounded-circle" style={{ width: '30px', height: '30px' }}></div>
                    )}
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={toggleSidebar}
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
                                    onClick={() => isMobile && setSidebarOpen(false)}
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
                            onClick={() => isMobile && setSidebarOpen(false)}
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
            </div>

            <style jsx>{`
                .sidebar {
                    width: 250px;
                    height: 100vh;
                    position: fixed;
                    transition: transform 0.3s ease, width 0.3s ease;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                }
                
                .sidebar.closed {
                    width: 70px;
                }
                
                .sidebar.closed .nav-link span,
                .sidebar.closed .badge,
                .sidebar.closed h5 {
                    display: none;
                }
                
                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }
                
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                
                /* Styles pour mobile */
                @media (max-width: 991.98px) {
                    .sidebar {
                        transform: translateX(-100%);
                        width: 280px;
                    }
                    
                    .sidebar.open {
                        transform: translateX(0);
                        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
                    }
                    
                    .sidebar.closed {
                        transform: translateX(-100%);
                    }
                    
                    .sidebar.mobile.closed {
                        display: none;
                    }
                }
                
                /* Styles pour desktop */
                @media (min-width: 992px) {
                    .sidebar-overlay {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}

export default OwnerSidebar;