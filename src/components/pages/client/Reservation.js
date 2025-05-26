import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../../assets/css/reservation.css';
import { 
  FiCalendar, FiClock, FiCheckCircle, 
  FiCreditCard, FiUser, FiInfo, FiDownload,
  FiPlus, FiMinus, FiArrowLeft
} from 'react-icons/fi';
//import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Configuration Stripe

// Données simulées
const serviceData = {
  id: 1,
  title: "Plomberie d'urgence",
  description: "Réparation de fuites et problèmes sanitaires urgents",
  basePrice: 89,
  duration: "2h",
  professional: {
    name: "Jean Dupont",
    rating: 4.8,
    phone: "+33 6 12 34 56 78"
  },
  addOns: [
    { id: 1, name: "Déplacement urgent (+50%)", price: 44.5 },
    { id: 2, name: "Pièces spéciales", price: 30 }
  ]
};

// Composant de paiement Stripe
{/** const StripePaymentForm = ({ onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      onSubmit(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="mb-3">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button 
        type="submit" 
        className="btn btn-primary w-100"
        disabled={!stripe || processing}
      >
        {processing ? 'Traitement...' : 'Payer maintenant'}
      </button>
    </form>
  );
};*/}

// Composant principal
const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [availability, setAvailability] = useState([]);
  const calendarRef = useRef(null);

  // Simuler le chargement des disponibilités
  useEffect(() => {
    const fetchAvailability = async () => {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer des créneaux disponibles fictifs
      const availableSlots = [];
      const today = new Date();
      
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Créneaux du matin
        if (i % 2 !== 0) {
          availableSlots.push({
            start: new Date(date.setHours(9, 0, 0)),
            end: new Date(date.setHours(11, 0, 0)),
            available: true,
            title: 'Disponible'
          });
          availableSlots.push({
            start: new Date(date.setHours(11, 0, 0)),
            end: new Date(date.setHours(12, 0, 0)),
            available: true,
            title: 'Disponible'
          });
        }
        
        // Créneaux de l'après-midi
        availableSlots.push({
          start: new Date(date.setHours(14, 0, 0)),
          end: new Date(date.setHours(16, 0, 0)),
          available: true,
          title: 'Disponible'
        });
        availableSlots.push({
          start: new Date(date.setHours(16, 0, 0)),
          end: new Date(date.setHours(18, 0, 0)),
          available: true,
          title: 'Disponible'
        });
      }
      
      setAvailability(availableSlots);
    };
    
    fetchAvailability();
  }, []);

  // Gestion de la sélection d'un créneau
  const handleSlotSelect = (selectInfo) => {
    const start = selectInfo.start;
    const end = selectInfo.end;
    
    // Vérifier si le créneau est disponible
    const isAvailable = availability.some(slot => 
      slot.start.getTime() === start.getTime() && 
      slot.end.getTime() === end.getTime() &&
      slot.available
    );
    
    if (isAvailable) {
      setSelectedSlot({ start, end });
      setStep(2);
    } else {
      alert("Ce créneau n'est plus disponible, veuillez en choisir un autre.");
    }
  };

  // Gestion des options supplémentaires
  const toggleAddOn = (addOn) => {
    if (addOns.some(a => a.id === addOn.id)) {
      setAddOns(addOns.filter(a => a.id !== addOn.id));
    } else {
      setAddOns([...addOns, addOn]);
    }
  };

  // Calcul du prix total
  const calculateTotal = () => {
    const addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return serviceData.basePrice + addOnsTotal;
  };

  // Soumission du paiement
  const handlePayment = async (paymentMethodId) => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // En production, vous enverriez le paymentMethodId à votre backend
    setBookingConfirmed(true);
    setStep(4);
  };

  // Formatage de la date
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Télécharger le reçu (simulé)
  const downloadReceipt = () => {
    alert("Téléchargement du reçu (simulé)");
  };

  // Ajouter au calendrier (fichier .ics simulé)
  const addToCalendar = () => {
    alert("Ajout au calendrier (simulé)");
  };

  // Rendu des étapes
  const renderStep = () => {
    switch(step) {
      case 1: // Sélection du service
        return (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h4 mb-4">{serviceData.title}</h2>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <FiClock className="me-2 text-primary" />
                  <span>Durée: {serviceData.duration}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FiUser className="me-2 text-primary" />
                  <span>Avec: {serviceData.professional.name} (★ {serviceData.professional.rating})</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FiInfo className="me-2 text-primary" />
                  <span>{serviceData.description}</span>
                </div>
                <div className="alert alert-info">
                  Prix de base: <strong>{serviceData.basePrice}€</strong>
                </div>
              </div>
              
              <button 
                className="btn btn-primary w-100"
                onClick={() => setStep(2)}
              >
                Voir les disponibilités
              </button>
            </div>
          </div>
        );
        
      case 2: // Sélection du créneau
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Choisissez un créneau</h2>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setStep(1)}
              >
                <FiArrowLeft className="me-1" /> Retour
              </button>
            </div>
            <div className="card-body">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                selectable={true}
                select={handleSlotSelect}
                events={availability.map(slot => ({
                  title: slot.title,
                  start: slot.start,
                  end: slot.end,
                  color: slot.available ? '#28a745' : '#6c757d',
                  allDay: false
                }))}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                weekends={false}
                locale="fr"
                height="auto"
                selectMirror={true}
                dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
              />
            </div>
          </div>
        );
        
      case 3: // Récapitulatif et paiement
        return (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h2 className="h5 mb-0">Confirmation de réservation</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h3 className="h6 mb-3">Détails du service</h3>
                <div className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Service:</span>
                    <span>{serviceData.title}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Date et heure:</span>
                    <span>{formatDate(selectedSlot.start)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Prestataire:</span>
                    <span>{serviceData.professional.name}</span>
                  </div>
                </div>
                
                <h3 className="h6 mb-3">Options supplémentaires</h3>
                <div className="mb-3">
                  {serviceData.addOns.map(addOn => (
                    <div key={addOn.id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`addon-${addOn.id}`}
                        checked={addOns.some(a => a.id === addOn.id)}
                        onChange={() => toggleAddOn(addOn)}
                      />
                      <label className="form-check-label" htmlFor={`addon-${addOn.id}`}>
                        {addOn.name} (+{addOn.price}€)
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total:</span>
                    <span>{calculateTotal()}€</span>
                  </div>
                </div>
              </div>
              
              {/* <Elements stripe={stripePromise}>
                <StripePaymentForm onSubmit={handlePayment} />
              </Elements>*/ }
            </div>
          </div>
        );
        
      case 4: // Confirmation
        return (
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body py-5">
              <FiCheckCircle className="text-success mb-3" style={{ fontSize: '3rem' }} />
              <h2 className="h4 mb-3">Réservation confirmée !</h2>
              <p className="mb-4">
                Votre réservation avec {serviceData.professional.name} pour le {formatDate(selectedSlot.start)} a été confirmée.
              </p>
              <p className="text-muted mb-4">
                Un email de confirmation avec les détails vous a été envoyé.
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-outline-primary"
                  onClick={downloadReceipt}
                >
                  <FiDownload className="me-2" />
                  Télécharger le reçu
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={addToCalendar}
                >
                  <FiCalendar className="me-2" />
                  Ajouter à mon calendrier
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Barre de progression */}
          <div className="mb-4">
            <div className="d-flex justify-content-between position-relative">
              <div className="progress position-absolute w-100" style={{ height: '2px', top: '50%' }}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>
              </div>
              
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="d-flex flex-column align-items-center position-relative">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center ${step >= i ? 'bg-primary text-white' : 'bg-light'}`}
                    style={{ width: '40px', height: '40px', zIndex: 1 }}
                  >
                    {i}
                  </div>
                  <small className="mt-2 text-muted">
                    {i === 1 && 'Service'}
                    {i === 2 && 'Créneau'}
                    {i === 3 && 'Paiement'}
                    {i === 4 && 'Confirmation'}
                  </small>
                </div>
              ))}
            </div>
          </div>
          
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Reservation;