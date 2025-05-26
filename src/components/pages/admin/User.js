import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiLock,
  FiUnlock,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiDollarSign,
  FiAlertTriangle,
  FiShield,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiTool,
  FiCreditCard
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const AdminSidebar = ({ isOpen }) => {
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
            <NavLink to="/admin/users" className="nav-link d-flex align-items-center rounded active">
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

const User = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    verified: '',
    active: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  const usersPerPage = 10;

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        // Données simulées
        const mockUsers = [
          { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'client', verified: true, active: true, lastLogin: '2023-06-20T14:30:00', registrationDate: '2023-01-15' },
          { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'prestataire', verified: true, active: true, lastLogin: '2023-06-21T09:15:00', registrationDate: '2023-02-10' },
          { id: 3, name: 'Pierre Lambert', email: 'pierre@example.com', role: 'prestataire', verified: false, active: true, lastLogin: '2023-06-18T16:45:00', registrationDate: '2023-03-05' },
          { id: 4, name: 'Sophie Bernard', email: 'sophie@example.com', role: 'client', verified: true, active: false, lastLogin: '2023-05-30T11:20:00', registrationDate: '2023-01-22' },
          { id: 5, name: 'Lucie Petit', email: 'lucie@example.com', role: 'admin', verified: true, active: true, lastLogin: '2023-06-21T08:00:00', registrationDate: '2023-01-10' },
          { id: 6, name: 'Thomas Moreau', email: 'thomas@example.com', role: 'prestataire', verified: true, active: true, lastLogin: '2023-06-20T17:30:00', registrationDate: '2023-04-18' },
          { id: 7, name: 'Emma Laurent', email: 'emma@example.com', role: 'client', verified: false, active: true, lastLogin: '2023-06-19T13:10:00', registrationDate: '2023-05-01' },
          { id: 8, name: 'Nicolas Girard', email: 'nicolas@example.com', role: 'client', verified: true, active: false, lastLogin: '2023-04-15T10:45:00', registrationDate: '2023-02-28' },
          { id: 9, name: 'Amélie Roux', email: 'amelie@example.com', role: 'prestataire', verified: true, active: true, lastLogin: '2023-06-21T10:20:00', registrationDate: '2023-03-15' },
          { id: 10, name: 'David Michel', email: 'david@example.com', role: 'client', verified: false, active: true, lastLogin: '2023-06-17T15:30:00', registrationDate: '2023-05-20' },
          { id: 11, name: 'Laura Simon', email: 'laura@example.com', role: 'prestataire', verified: true, active: false, lastLogin: '2023-05-10T09:00:00', registrationDate: '2023-01-05' },
          { id: 12, name: 'Alexandre Leroy', email: 'alexandre@example.com', role: 'client', verified: true, active: true, lastLogin: '2023-06-21T12:45:00', registrationDate: '2023-04-10' }
        ];

        // Simuler des journaux d'activité
        const mockLogs = [
          { id: 1, userId: 1, action: 'Connexion', date: '2023-06-20T14:30:00', ip: '192.168.1.1' },
          { id: 2, userId: 1, action: 'Mise à jour profil', date: '2023-06-18T10:15:00', ip: '192.168.1.1' },
          { id: 3, userId: 1, action: 'Réservation service', date: '2023-06-15T16:20:00', ip: '192.168.1.2' },
          { id: 4, userId: 1, action: 'Connexion', date: '2023-06-10T09:30:00', ip: '192.168.1.3' }
        ];

        setUsers(mockUsers);
        setActivityLogs(mockLogs);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Filtrer et rechercher les utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filters.role === '' || user.role === filters.role;
      const matchesVerified = filters.verified === '' || 
                            (filters.verified === 'verified' && user.verified) || 
                            (filters.verified === 'unverified' && !user.verified);
      const matchesActive = filters.active === '' || 
                          (filters.active === 'active' && user.active) || 
                          (filters.active === 'inactive' && !user.active);
      
      return matchesSearch && matchesRole && matchesVerified && matchesActive;
    });
  }, [users, searchTerm, filters]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Gérer les actions sur les utilisateurs
  const handleUserAction = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (modalAction === 'delete') {
      setUsers(users.filter(u => u.id !== selectedUser.id));
    } else if (modalAction === 'toggle') {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, active: !u.active } : u
      ));
    }
    setShowModal(false);
  };

  const viewActivityLog = (user) => {
    setSelectedUser(user);
    setShowActivityLog(true);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar isOpen={sidebarOpen} />
      
      <div className="flex-grow-1 admin-content" style={{ 
        marginLeft: sidebarOpen ? '250px' : '80px',
        transition: 'margin-left 0.3s ease',
        padding: '20px'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <FiUsers className="me-2" />
            Gestion des Utilisateurs
          </h2>
          <button 
            className="btn btn-outline-secondary d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      <FiFilter className="me-1" /> Rôle: {filters.role || 'Tous'}
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, role: ''})}>Tous</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, role: 'client'})}>Clients</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, role: 'prestataire'})}>Prestataires</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, role: 'admin'})}>Admins</button></li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      <FiFilter className="me-1" /> Vérification: {filters.verified === 'verified' ? 'Vérifié' : filters.verified === 'unverified' ? 'Non vérifié' : 'Tous'}
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, verified: ''})}>Tous</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, verified: 'verified'})}>Vérifié</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, verified: 'unverified'})}>Non vérifié</button></li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      <FiFilter className="me-1" /> Statut: {filters.active === 'active' ? 'Actif' : filters.active === 'inactive' ? 'Inactif' : 'Tous'}
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, active: ''})}>Tous</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, active: 'active'})}>Actif</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilters({...filters, active: 'inactive'})}>Inactif</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {/* Tableau des utilisateurs */}
            <div className="card mb-4">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Vérifié</th>
                      <th>Statut</th>
                      <th>Dernière connexion</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge 
                              bg={
                                user.role === 'admin' ? 'danger' : 
                                user.role === 'prestataire' ? 'info' : 'secondary'
                              }
                            >
                              {user.role === 'client' ? 'Client' : 
                              user.role === 'prestataire' ? 'Prestataire' : 'Admin'}
                            </Badge>
                          </td>
                          <td>
                            {user.verified ? (
                              <FiCheckCircle className="text-success" />
                            ) : (
                              <FiXCircle className="text-danger" />
                            )}
                          </td>
                          <td>
                            <Badge bg={user.active ? 'success' : 'warning'}>
                              {user.active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td>{formatDate(user.lastLogin)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => viewActivityLog(user)}
                                title="Journal d'activité"
                              >
                                <FiClock />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                title="Modifier"
                              >
                                <FiEdit />
                              </button>
                              {user.active ? (
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleUserAction(user, 'toggle')}
                                  title="Bloquer"
                                >
                                  <FiLock />
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleUserAction(user, 'toggle')}
                                  title="Débloquer"
                                >
                                  <FiUnlock />
                                </button>
                              )}
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleUserAction(user, 'delete')}
                                title="Supprimer"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage - 1)}
                    >
                      <FiChevronLeft />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li 
                      key={i} 
                      className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage + 1)}
                    >
                      <FiChevronRight />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}

        {/* Modal de confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalAction === 'delete' ? 'Confirmer la suppression' : 'Confirmer le changement de statut'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalAction === 'delete' ? (
              <p>Êtes-vous sûr de vouloir supprimer définitivement le compte de {selectedUser?.name} ?</p>
            ) : (
              <p>
                Êtes-vous sûr de vouloir {selectedUser?.active ? 'bloquer' : 'débloquer'} le compte de {selectedUser?.name} ?
                <br />
                {selectedUser?.active ? 'L\'utilisateur ne pourra plus se connecter.' : 'L\'utilisateur pourra à nouveau se connecter.'}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant={modalAction === 'delete' ? 'danger' : 'warning'} onClick={confirmAction}>
              {modalAction === 'delete' ? 'Supprimer' : selectedUser?.active ? 'Bloquer' : 'Débloquer'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal du journal d'activité */}
        <Modal 
          show={showActivityLog} 
          onHide={() => setShowActivityLog(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Journal d'activité - {selectedUser?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.filter(log => log.userId === selectedUser?.id).length > 0 ? (
                    activityLogs
                      .filter(log => log.userId === selectedUser?.id)
                      .map(log => (
                        <tr key={log.id}>
                          <td>{formatDate(log.date)}</td>
                          <td>{log.action}</td>
                          <td>{log.ip}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-3">
                        Aucune activité enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowActivityLog(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
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
        
        .table th {
          white-space: nowrap;
        }
        
        .badge {
          font-weight: normal;
        }
        
        .dropdown-menu {
          padding: 0.5rem;
        }
        
        .dropdown-item {
          border-radius: 4px;
          padding: 0.25rem 1rem;
        }
      `}</style>
    </div>
  );
};

export default User;