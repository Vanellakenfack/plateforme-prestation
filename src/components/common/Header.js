import React, { useState, useEffect } from 'react';
import { FiUser, FiMenu, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import { MdOutlineHandyman } from 'react-icons/md';
import { Link } from 'react-router-dom';
import '../../assets/css/header.css'; // Fichier CSS personnalisé

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <MdOutlineHandyman className="logo-icon me-2" />
          <span className="brand-text">ProArtisans</span>
        </Link>

        {/* Bouton menu mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation principale */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
              <Link to="/" className="nav-link">Accueil</Link>
            </li>
            <li className="nav-item dropdown">
              <Link 
                to="/services" 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                role="button"
              >
                Services <FiChevronDown className="ms-1 dropdown-icon" />
              </Link>
              
            </li>
            
            <li className="nav-item">
              <Link to="/professional" className="nav-link">Trouver un professionel</Link>
            </li>
            
            <li className="nav-item">
              <Link to="/clientdashboard" className="nav-link">mon espace</Link>
            </li>
            
            <li className="nav-item">
              <Link to="/blog" className="nav-link"></Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="d-flex align-items-center">
            <form className="d-none d-md-flex me-3">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Rechercher..." 
                />
                <button className="btn btn-outline-secondary search-btn" type="button">
                  <FiSearch />
                </button>
              </div>
            </form>
            
            <div className="auth-buttons d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary d-flex align-items-center">
                <FiUser className="me-1" /> Connexion
              </Link>
              <Link to="/login" className="btn btn-primary">
                Espace pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;