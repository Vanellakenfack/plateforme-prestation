import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUserTie, FaInfoCircle, FaCheck, FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE_URL = 'http://localhost:8000/api';

const Reservation = () => {
  // États
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationError, setReservationError] = useState(null);

  // Charger les services avec les prestataires associés
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Utilisateur non authentifié');

      const response = await axios.get(`${API_BASE_URL}/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          with: 'prestataire' // Charger les prestataires avec les services
        }
      });

      setServices(response.data.data || response.data);
      setServiceError(null);
    } catch (err) {
      console.error('Erreur:', {
        error: err,
        response: err.response?.data
      });
      setServiceError(
        err.response?.data?.message || 
        err.message || 
        'Erreur lors du chargement des services'
      );
    } finally {
      setLoadingServices(false);
    }
  };

  // Charger les créneaux disponibles
  const fetchAvailableSlots = async () => {
    if (!selectedService) {
      setReservationError('Veuillez sélectionner un service');
      return;
    }
    
    setLoadingSlots(true);
    setReservationError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const service = services.find(s => s.id === selectedService);
      
      if (!service || !service.prestataire_id) {
        throw new Error('Prestataire non trouvé pour ce service');
      }

      const response = await axios.get(
        `${API_BASE_URL}/prestataires/${service.prestataire_id}/disponibilites/${date.toISOString().split('T')[0]}`, 
        {
          params: { 
            duration,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      setAvailableSlots(response.data.creneaux || []);
      setStep(2);
    } catch (err) {
      console.error('Erreur:', err.response?.data || err.message);
      setReservationError(
        err.response?.data?.message || 
        'Aucun créneau disponible - Essayez une autre date'
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  // Soumettre la réservation
  const handleSubmit = async () => {
    if (!selectedService || !startTime || !endTime) {
      setReservationError('Veuillez compléter tous les champs');
      return;
    }

    setLoadingSlots(true);
    setReservationError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const service = services.find(s => s.id === selectedService);
      
      if (!service || !service.prestataire_id) {
        throw new Error('Service ou prestataire invalide');
      }

      await axios.post(`${API_BASE_URL}/bookings`, {
        service_id: selectedService,
        prestataire_id: service.prestataire_id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
    } catch (err) {
      console.error('Erreur:', err.response?.data || err.message);
      setReservationError(
        err.response?.data?.message || 
        'Erreur lors de la réservation'
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchServices();
  }, []);

  // Rendu conditionnel
  if (loadingServices) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>Erreur</h5>
          <p>{serviceError}</p>
          <button className="btn btn-primary" onClick={fetchServices}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-5">
        <div className="card shadow-lg border-0">
          <div className="card-body text-center p-5">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
              <FaCheck className="text-success" size={48} />
            </div>
            <h2 className="mb-3">Réservation confirmée!</h2>
            <p className="text-muted mb-4">
              Votre réservation a été enregistrée avec succès.
            </p>
            <button 
              className="btn btn-primary px-4"
              onClick={() => {
                setSuccess(false);
                setStep(1);
                setSelectedService(null);
                setStartTime(null);
                setEndTime(null);
                setNotes('');
              }}
            >
              Faire une nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 pt-4">
              <h2 className="text-center mb-0">Réserver un service</h2>
              <div className="d-flex justify-content-center mt-3">
                {[1, 2, 3].map((stepNumber) => (
                  <React.Fragment key={stepNumber}>
                    <div className={`rounded-circle ${step >= stepNumber ? 'bg-primary' : 'bg-light'} text-white d-flex align-items-center justify-content-center`} 
                      style={{ width: '36px', height: '36px' }}>
                      <span className="fw-bold">{stepNumber}</span>
                    </div>
                    {stepNumber < 3 && (
                      <div className={`mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-light'}`} 
                        style={{ height: '2px', width: '40px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {reservationError && (
                <div className="alert alert-danger mb-4">
                  {reservationError}
                  {reservationError.includes('disponible') && (
                    <button 
                      className="btn btn-sm btn-outline-danger ms-3"
                      onClick={fetchAvailableSlots}
                    >
                      Réessayer
                    </button>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="mb-4">
                  <h4 className="mb-4"><FaUserTie className="me-2" />Sélectionnez un service</h4>
                  {services.length === 0 ? (
                    <div className="alert alert-info">Aucun service disponible pour le moment</div>
                  ) : (
                    <>
                      <div className="row g-3">
                        {services.map(service => (
                          <div className="col-md-6" key={service.id}>
                            <div 
                              className={`card h-100 ${selectedService === service.id ? 'border-primary border-2' : 'border-light'}`}
                              onClick={() => setSelectedService(service.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body">
                                <h5 className="card-title">{service.titre}</h5>
                                <p className="card-text text-muted">{service.description}</p>
                                <div className="d-flex align-items-center mt-3">
                                  <span className="badge bg-primary me-2">
                                    {service.prestataire?.metier || 'Métier inconnu'}
                                  </span>
                                  <span className="text-primary fw-bold">
                                    {service.prix} FC / {service.unite_prix}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedService && (
                        <div className="d-flex justify-content-end mt-4">
                          <button 
                            className="btn btn-primary px-4"
                            onClick={fetchAvailableSlots}
                            disabled={!services.find(s => s.id === selectedService)?.prestataire_id}
                          >
                            Choisir un créneau <FaCalendarAlt className="ms-2" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <button 
                    className="btn btn-link mb-3 p-0"
                    onClick={() => setStep(1)}
                  >
                    <FaArrowLeft className="me-2" /> Retour
                  </button>
                  <h4 className="mb-4"><FaClock className="me-2" />Choisissez un créneau</h4>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Date</label>
                      <DatePicker
                        selected={date}
                        onChange={(date) => {
                          if (date < new Date().setHours(0, 0, 0, 0)) {
                            setReservationError('La date ne peut pas être dans le passé');
                            return;
                          }
                          setDate(date);
                          setStartTime(null);
                          setAvailableSlots([]);
                        }}
                        minDate={new Date()}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Durée (heures)</label>
                      <select 
                        className="form-select" 
                        value={duration}
                        onChange={(e) => {
                          const newDuration = parseInt(e.target.value);
                          if (newDuration > 8) {
                            setReservationError('La durée maximale est de 8 heures');
                            return;
                          }
                          setDuration(newDuration);
                          setStartTime(null);
                          setAvailableSlots([]);
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                          <option key={h} value={h}>{h} heure{h > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary mb-4"
                    onClick={fetchAvailableSlots}
                    disabled={!date || loadingSlots}
                  >
                    {loadingSlots ? 'Chargement...' : 'Voir les disponibilités'}
                  </button>

                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="row g-2">
                      {availableSlots.map((slot, index) => {
                        const slotStart = new Date(slot.debut_iso || slot.start);
                        const slotEnd = new Date(slot.fin_iso || slot.end);
                        return (
                          <div className="col-6 col-md-4" key={index}>
                            <button
                              className={`btn w-100 ${
                                startTime?.getTime() === slotStart.getTime() 
                                  ? 'btn-primary' 
                                  : 'btn-outline-primary'
                              }`}
                              onClick={() => {
                                setStartTime(slotStart);
                                setEndTime(slotEnd);
                              }}
                            >
                              {slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              <br/>
                              <small className="text-muted">
                                {Math.round((slotEnd - slotStart) / (1000 * 60))} min
                              </small>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    !reservationError && (
                      <div className="alert alert-info">
                        Aucun créneau disponible pour ces critères.
                      </div>
                    )
                  )}

                  {startTime && (
                    <div className="mt-4">
                      <div className="mb-3">
                        <h5>Récapitulatif</h5>
                        <p>
                          <strong>Service:</strong> {services.find(s => s.id === selectedService)?.titre}<br />
                          <strong>Prestataire:</strong> {services.find(s => s.id === selectedService)?.prestataire?.metier}<br />
                          <strong>Date:</strong> {date.toLocaleDateString('fr-FR')}<br />
                          <strong>Heure:</strong> {startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label"><FaInfoCircle className="me-2" />Notes supplémentaires (optionnel)</label>
                        <textarea 
                          className="form-control" 
                          rows="3" 
                          value={notes} 
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Informations complémentaires pour le prestataire..."
                        />
                      </div>

                      <div className="d-flex justify-content-between">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => setStep(1)}
                        >
                          Retour
                        </button>
                        <button 
                          className="btn btn-success px-4"
                          onClick={handleSubmit}
                          disabled={loadingSlots}
                        >
                          {loadingSlots ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              En cours...
                            </>
                          ) : (
                            'Confirmer la réservation'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;