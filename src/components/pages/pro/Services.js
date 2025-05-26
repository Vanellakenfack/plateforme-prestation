import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiTag, FiImage } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';
const Services = () => {
  // États pour la gestion des services
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Plomberie résidentielle",
      description: "Réparation de fuites, installation de sanitaires et dépannage urgent",
      price: 65,
      images: ["plomberie.jpg"],
      active: true,
      promotion: null
    },
    {
      id: 2,
      title: "Installation électrique",
      description: "Mise aux normes, tableau électrique et éclairage",
      price: 80,
      images: ["electricite.jpg"],
      active: true,
      promotion: {
        discountedPrice: 70,
        endDate: "2023-12-31"
      }
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Gestion du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
    promotion: {
      active: false,
      discountedPrice: '',
      endDate: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromotionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [name]: value
      }
    }));
  };

  const toggleServiceStatus = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Mise à jour du service existant
      setServices(services.map(service => 
        service.id === currentService.id ? formData : service
      ));
    } else {
      // Ajout d'un nouveau service
      const newService = {
        id: services.length + 1,
        ...formData,
        active: true
      };
      setServices([...services, newService]);
    }
    setShowModal(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData(service);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    // Simuler l'upload d'images
    const files = Array.from(e.target.files);
    const images = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...images]
    }));
  };

  return (
    
    <div className="container-fluid" style={{ marginLeft: '250px' }} >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des Services</h2>
        <OwnerSidebar></OwnerSidebar>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              price: '',
              images: [],
              promotion: {
                active: false,
                discountedPrice: '',
                endDate: ''
              }
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <FiPlus className="me-2" />
          Ajouter un service
        </button>
      </div>

      {/* Liste des services */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {services.map(service => (
          <div key={service.id} className="col">
            <div className="card h-100">
              <div className="position-relative">
                {service.images.length > 0 ? (
                  <img 
                    src={service.images[0]} 
                    className="card-img-top" 
                    alt={service.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center" 
                       style={{ height: '180px' }}>
                    <FiImage className="text-muted fs-1" />
                  </div>
                )}
                <div className="position-absolute top-0 end-0 m-2">
                  <button 
                    className={`btn btn-sm ${service.active ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    {service.active ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
                {service.promotion && (
                  <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">
                    PROMO
                  </span>
                )}
              </div>
              
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{service.title}</h5>
                  <div>
                    {service.promotion ? (
                      <>
                        <span className="text-danger fw-bold me-2">{service.promotion.discountedPrice}€</span>
                        <span className="text-decoration-line-through text-muted small">{service.price}€</span>
                      </>
                    ) : (
                      <span className="fw-bold">{service.price}€</span>
                    )}
                  </div>
                </div>
                <p className="card-text text-muted small">{service.description}</p>
                
                {service.promotion && (
                  <div className="alert alert-warning p-2 small mb-3">
                    <FiTag className="me-1" />
                    Promotion valable jusqu'au {new Date(service.promotion.endDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="card-footer bg-white d-flex justify-content-end gap-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(service)}
                >
                  <FiEdit />
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(service.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour ajouter/modifier un service */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? 'Modifier le service' : 'Ajouter un nouveau service'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Titre du service</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Prix standard (€)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Images</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {formData.images.map((img, index) => (
                          <img 
                            key={index} 
                            src={img} 
                            alt="Preview" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-header d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id="promotionCheck"
                        checked={formData.promotion.active}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          promotion: {
                            ...prev.promotion,
                            active: e.target.checked
                          }
                        }))}
                      />
                      <label className="form-check-label fw-bold" htmlFor="promotionCheck">
                        Ajouter une promotion
                      </label>
                    </div>
                    {formData.promotion.active && (
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Prix promotionnel (€)</label>
                            <input
                              type="number"
                              className="form-control"
                              name="discountedPrice"
                              value={formData.promotion.discountedPrice}
                              onChange={handlePromotionChange}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Date de fin</label>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formData.promotion.endDate}
                              onChange={handlePromotionChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;