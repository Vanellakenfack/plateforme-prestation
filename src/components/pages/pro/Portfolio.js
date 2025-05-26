import React, { useState, useRef } from 'react';
import { FiUpload, FiImage, FiFileText, FiVideo, FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';
import { Modal, Button, ProgressBar, Tab, Tabs } from 'react-bootstrap';

const Portfolio = () => {
  // États pour les onglets et les médias
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      type: 'image',
      title: 'Installation électrique',
      file: 'electricite.jpg',
      date: '2023-05-15'
    },
    {
      id: 2,
      type: 'video',
      title: 'Tutoriel plomberie',
      file: 'plomberie.mp4',
      date: '2023-04-10'
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      title: 'Certification électricien',
      file: 'certif-elec.pdf',
      date: '2022-06-20',
      issuer: 'Organisme Professionnel'
    }
  ]);

  // États pour les modales et uploads
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileType, setCurrentFileType] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    file: null
  });
  const fileInputRef = useRef(null);

  // Gestion des fichiers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({
        ...prev,
        file,
        type: currentFileType
      }));
    }
  };

  const triggerFileInput = (type) => {
    setCurrentFileType(type);
    fileInputRef.current.click();
  };

  // Simulation d'upload
  const handleUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      const newItemToAdd = {
        id: Date.now(),
        ...newItem,
        date: new Date().toISOString().split('T')[0]
      };

      if (activeTab === 'portfolio') {
        setPortfolioItems([...portfolioItems, newItemToAdd]);
      } else {
        setCertifications([...certifications, newItemToAdd]);
      }

      setNewItem({ title: '', description: '', file: null });
      setUploadProgress(0);
      setShowUploadModal(false);
    }, 2200);
  };

  // Suppression d'un élément
  const handleDelete = (id) => {
    if (activeTab === 'portfolio') {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    } else {
      setCertifications(certifications.filter(cert => cert.id !== id));
    }
  };

  return (
    <div className="d-flex">
      <OwnerSidebar />
      
      <main className="main-content">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              Portfolio et Certifications
            </h2>
            <Button 
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <FiPlus className="me-2" />
              Ajouter
            </Button>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="portfolio" title="Portfolio">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
                {portfolioItems.map(item => (
                  <div key={item.id} className="col">
                    <div className="card h-100">
                      <div className="card-img-top-container">
                        {item.type === 'image' && (
                          <img 
                            src={`/uploads/${item.file}`} 
                            alt={item.title}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        {item.type === 'video' && (
                          <div className="ratio ratio-16x9">
                            <video controls style={{ height: '200px' }}>
                              <source src={`/uploads/${item.file}`} type="video/mp4" />
                            </video>
                          </div>
                        )}
                        {item.type === 'pdf' && (
                          <div className="d-flex align-items-center justify-content-center bg-light" 
                               style={{ height: '200px' }}>
                            <FiFileText className="text-muted fs-1" />
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text text-muted small">
                          Ajouté le {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="card-footer bg-white d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm">
                          <FiEdit2 />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>
            <Tab eventKey="certifications" title="Certifications">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
                {certifications.map(cert => (
                  <div key={cert.id} className="col">
                    <div className="card h-100">
                      <div className="d-flex align-items-center justify-content-center bg-light" 
                           style={{ height: '200px' }}>
                        <FiFileText className="text-muted fs-1" />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{cert.title}</h5>
                        <p className="card-text text-muted small mb-1">
                          Émis par : {cert.issuer}
                        </p>
                        <p className="card-text text-muted small">
                          Obtenu le {new Date(cert.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="card-footer bg-white d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm">
                          <FiEdit2 />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(cert.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
      </main>

      {/* Modal d'ajout */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Ajouter un {activeTab === 'portfolio' ? 'élément au portfolio' : 'certificat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            ></textarea>
          </div>

          {activeTab === 'certifications' && (
            <div className="mb-3">
              <label className="form-label">Organisme émetteur</label>
              <input
                type="text"
                className="form-control"
                value={newItem.issuer || ''}
                onChange={(e) => setNewItem({...newItem, issuer: e.target.value})}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Fichier</label>
            {!newItem.file ? (
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => triggerFileInput('image')}
                >
                  <FiImage className="me-2" />
                  Image
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => triggerFileInput('pdf')}
                >
                  <FiFileText className="me-2" />
                  PDF
                </Button>
                {activeTab === 'portfolio' && (
                  <Button 
                    variant="outline-secondary"
                    onClick={() => triggerFileInput('video')}
                  >
                    <FiVideo className="me-2" />
                    Vidéo
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={activeTab === 'portfolio' ? "image/*,video/*,.pdf" : ".pdf"}
                  className="d-none"
                />
              </div>
            ) : (
              <div className="alert alert-light d-flex justify-content-between align-items-center">
                <span>{newItem.file.name}</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setNewItem({...newItem, file: null})}
                >
                  <FiTrash2 className="text-danger" />
                </Button>
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={!newItem.title || !newItem.file || (activeTab === 'certifications' && !newItem.issuer)}
          >
            <FiUpload className="me-2" />
            Téléverser
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Portfolio;