import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiXCircle, FiSave, FiRefreshCw } from 'react-icons/fi';
import '../../../assets/css/disponibilite.css'
import './OwnerSidebar'
import OwnerSidebar from './OwnerSidebar';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const AvailabilityCalendar = () => { // Ne reçoit plus prestataireId en prop
  const getStartOfWeek = (date) => {
    const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Ajuste au lundi (ou dimanche si vous préférez)
    // Pour le lundi comme début de semaine (ISO 8601), day 0 (dimanche) doit devenir 6 (dimanche précédent)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const newDate = new Date(date.setDate(diff));
    newDate.setHours(0, 0, 0, 0); // Réinitialise l'heure pour éviter les problèmes de fuseau horaire
    return newDate;
  };

  const [internalPrestataireId, setInternalPrestataireId] = useState(null); // Nouvel état pour l'ID interne
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [availabilities, setAvailabilities] = useState({}); // { 'YYYY-MM-DD': { morning: true, afternoon: false, evening: true } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Pour gérer le chargement de l'utilisateur

  const timeSlots = [
    { key: 'morning', label: 'Matin (9h-12h)' },
    { key: 'afternoon', label: 'Après-midi (13h-17h)' },
    { key: 'evening', label: 'Soir (18h-21h)' },
  ];

  // Fonction utilitaire pour formater les dates
  const formatDate = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD
  const formatDisplayDate = (date) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Générer les jours de la semaine
  const getWeekDays = (startOfWeek) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Récupérer l'ID de l'utilisateur connecté au montage du composant
  useEffect(() => {
    const fetchUserId = async () => {
      setIsUserLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.warn('Aucun token trouvé, impossible de récupérer l\'ID utilisateur.');
          setError('Veuillez vous connecter pour gérer vos disponibilités.');
          setIsUserLoading(false);
          return;
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/user'); // Assurez-vous que cette route renvoie l'ID de l'utilisateur
        if (res.data && res.data.id) {
          setInternalPrestataireId(res.data.id);
        } else {
          setError('Impossible de récupérer l\'ID du prestataire. Vérifiez votre connexion.');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', err.response?.data || err.message);
        setError('Erreur lors de la récupération de l\'ID utilisateur.');
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUserId();
  }, []); // Exécuter une seule fois au montage

  // Récupérer les disponibilités du backend une fois que l'ID du prestataire est connu
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!internalPrestataireId) { // Ne pas fetch si l'ID n'est pas prêt
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const startDate = formatDate(currentWeekStart);
        const endDate = formatDate(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)); // 6 jours après le début

        const res = await api.get(`/availabilities/${internalPrestataireId}`, {
          params: { startDate, endDate }
        });
        
        const fetchedData = {};
        for (const dateKey in res.data) {
            fetchedData[dateKey] = res.data[dateKey];
        }
        setAvailabilities(fetchedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des disponibilités:', err.response?.data || err.message);
        setError('Erreur lors du chargement des disponibilités. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    if (internalPrestataireId) { // S'assurer que l'ID est disponible avant de lancer le fetch
      fetchAvailabilities();
    }
  }, [internalPrestataireId, currentWeekStart]); // Re-fetch quand l'ID ou la semaine change

  // Gérer le basculement de disponibilité d'un créneau
  const toggleAvailability = (date, slotKey) => {
    setAvailabilities(prevAvail => {
      const dateStr = formatDate(date);
      const currentSlots = prevAvail[dateStr] || { morning: false, afternoon: false, evening: false };
      return {
        ...prevAvail,
        [dateStr]: {
          ...currentSlots,
          [slotKey]: !currentSlots[slotKey]
        }
      };
    });
  };

  // Enregistrer les modifications des disponibilités
  const saveAvailabilities = async () => {
    if (!internalPrestataireId) {
      setError('ID du prestataire non disponible pour la sauvegarde.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Préparer les données à envoyer au backend
      const dataToSave = Object.keys(availabilities).map(date => ({
        date: date,
        prestataire_id: internalPrestataireId, // Utilise l'ID interne
        slots: availabilities[date]
      }));

      await api.post(`/availabilities/${internalPrestataireId}/batch-update`, dataToSave); 
      
      alert('Disponibilités sauvegardées avec succès !');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des disponibilités:', err.response?.data || err.message);
      setError('Erreur lors de la sauvegarde des disponibilités.');
    } finally {
      setLoading(false);
    }
  };

  // Naviguer vers la semaine précédente/suivante
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const weekDays = getWeekDays(currentWeekStart);

  // Affichage conditionnel pendant le chargement de l'ID utilisateur
  if (isUserLoading) {
    return (
      <div className="availability-calendar-container dashboard-card p-4 text-center">
        <FiRefreshCw className="spin-animation" size={40} />
        <p className="mt-3">Chargement de votre profil prestataire...</p>
      </div>
    );
  }

  // Affichage si l'ID utilisateur n'a pas pu être récupéré
  if (!internalPrestataireId && !isUserLoading) {
    return (
      <div className="availability-calendar-container dashboard-card p-4 text-center">
        <div className="alert alert-danger" role="alert">
          {error || "Impossible de charger l'ID du prestataire. Veuillez vérifier votre connexion."}
        </div>
      </div>
    );
  }

  return (
    
    <div className="availability-calendar-container dashboard-card p-4">
        <OwnerSidebar></OwnerSidebar>
      <div className="calendar-header d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-primary" onClick={goToPreviousWeek}>
          <FiChevronLeft /> Semaine précédente
        </button>
        <h4 className="mb-0 text-primary fw-bold">
          Semaine du {formatDisplayDate(weekDays[0])} au {formatDisplayDate(weekDays[6])}
        </h4>
        <button className="btn btn-outline-primary" onClick={goToNextWeek}>
          Semaine suivante <FiChevronRight />
        </button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <FiRefreshCw className="spin-animation" size={30} /> Chargement des disponibilités...
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="calendar-grid">
          {weekDays.map(day => {
            const dateStr = formatDate(day);
            const dayAvailabilities = availabilities[dateStr] || { morning: false, afternoon: false, evening: false };
            return (
              <div key={dateStr} className="calendar-day-card">
                <div className="day-header">
                  <span className="day-name">{new Date(day).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                  <span className="day-date">{new Date(day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })}</span>
                </div>
                <div className="day-slots">
                  {timeSlots.map(slot => (
                    <div 
                      key={slot.key} 
                      className={`slot-item ${dayAvailabilities[slot.key] ? 'available' : 'unavailable'}`}
                      onClick={() => toggleAvailability(day, slot.key)}
                      title={dayAvailabilities[slot.key] ? 'Disponible' : 'Non disponible'}
                    >
                      {dayAvailabilities[slot.key] ? <FiCheckCircle /> : <FiXCircle />}
                      <span>{slot.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg" onClick={saveAvailabilities} disabled={loading}>
          <FiSave className="me-2" /> Sauvegarder les disponibilités
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
