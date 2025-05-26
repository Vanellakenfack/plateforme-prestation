import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { MdOutlineHandyman } from 'react-icons/md';

function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Colonne Logo et description */}
          <div className="col-lg-4 mb-4">
            <div className="footer-brand d-flex align-items-center mb-3">
              <MdOutlineHandyman className="footer-logo-icon me-2" />
              <span className="footer-brand-text">ProArtisans</span>
            </div>
            <p className="footer-text">
              La plateforme qui connecte les particuliers avec les meilleurs artisans 
              pour tous types de travaux. Qualité, fiabilité et transparence.
            </p>
            <div className="social-icons d-flex gap-3 mt-3">
              <a href="#" className="text-white"><FiFacebook size={20} /></a>
              <a href="#" className="text-white"><FiTwitter size={20} /></a>
              <a href="#" className="text-white"><FiInstagram size={20} /></a>
              <a href="#" className="text-white"><FiLinkedin size={20} /></a>
            </div>
          </div>

          {/* Colonne Liens rapides */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title mb-3">Liens rapides</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><Link to="/" className="footer-link">Accueil</Link></li>
              <li className="mb-2"><Link to="/services" className="footer-link">Services</Link></li>
              <li className="mb-2"><Link to="/artisans" className="footer-link">Artisans</Link></li>
              <li className="mb-2"><Link to="/about" className="footer-link">À propos</Link></li>
              <li className="mb-2"><Link to="/blog" className="footer-link">Conseils</Link></li>
            </ul>
          </div>

          {/* Colonne Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title mb-3">Services</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><Link to="/services/plomberie" className="footer-link">Plomberie</Link></li>
              <li className="mb-2"><Link to="/services/electricite" className="footer-link">Électricité</Link></li>
              <li className="mb-2"><Link to="/services/maçonnerie" className="footer-link">Maçonnerie</Link></li>
              <li className="mb-2"><Link to="/services/nettoyage" className="footer-link">Nettoyage</Link></li>
              <li className="mb-2"><Link to="/services/autres" className="footer-link">Autres services</Link></li>
            </ul>
          </div>

          {/* Colonne Contact */}
          <div className="col-lg-4 mb-4">
            <h5 className="footer-title mb-3">Contactez-nous</h5>
            <ul className="footer-contact list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <FiMapPin className="me-e des Artisans, 75000 Paris, France2 mt-1" />
                <span>123 Ru</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FiPhone className="me-2" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="d-flex align-items-center">
                <FiMail className="me-2" />
                <span>contact@proartisans.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {new Date().getFullYear()} ProArtisans. Tous droits réservés.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="footer-legal-link me-3">Politique de confidentialité</Link>
            <Link to="/terms" className="footer-legal-link">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;