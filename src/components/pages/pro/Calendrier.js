import React, { useState, useRef } from 'react';
import { FiCalendar, FiClock, FiPlus, FiTrash2, FiSettings, FiRefreshCw } from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import OwnerSidebar from './OwnerSidebar'
import { Modal, Button } from 'react-bootstrap';

const Calendrier = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Disponible',
      start: new Date().toISOString().split('T')[0] + 'T09:00:00',
      end: new Date().toISOString().split('T')[0] + 'T12:00:00',
      color: '#4ade80',
      extendedProps: {
        type: 'availability'
      }
    }
  ]);
  
  const [view, setView] = useState('timeGridWeek');
  const calendarRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Gestion des créneaux
  const handleDateSelect = (selectInfo) => {
    const title = 'Disponible';
    const calendarApi = selectInfo.view.calendar;
    
    calendarApi.unselect();
    
    calendarApi.addEvent({
      id: Date.now(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: '#4ade80',
      extendedProps: {
        type: 'availability'
      }
    });
  };

  const handleEventClick = (clickInfo) => {
    setEventToDelete(clickInfo.event);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      eventToDelete.remove();
    }
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const confirmClearAll = () => {
    setEvents(events.filter(e => e.extendedProps.type !== 'availability'));
    setShowClearModal(false);
  };

  // Export des disponibilités
  const exportAvailability = () => {
    const ics = events
      .filter(event => event.extendedProps.type === 'availability')
      .map(event => {
        return `BEGIN:VEVENT
DTSTART:${event.start.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z')}
DTEND:${event.end.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z')}
SUMMARY:${event.title}
END:VEVENT`;
      }).join('\n');

    const blob = new Blob([`BEGIN:VCALENDAR\n${ics}\nEND:VCALENDAR`], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'disponibilites.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="d-flex">
      <OwnerSidebar />
      
      <main className="main-content">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2 className="mb-3 mb-md-0">
              <FiCalendar className="me-2" />
              Calendrier de disponibilité
            </h2>
            
            <div className="d-flex gap-2">
              <select 
                className="form-select w-auto"
                value={view}
                onChange={(e) => {
                  setView(e.target.value);
                  calendarRef.current.getApi().changeView(e.target.value);
                }}
              >
                <option value="timeGridDay">Jour</option>
                <option value="timeGridWeek">Semaine</option>
                <option value="dayGridMonth">Mois</option>
              </select>
              
              <button className="btn btn-primary" onClick={exportAvailability}>
                <FiSettings className="me-1" />
                Exporter
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                locale={frLocale}
                headerToolbar={false}
                selectable={true}
                editable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                weekends={false}
                height="75vh"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
              />
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <div className="d-flex align-items-center">
                <div className="availability-badge me-2"></div>
                <small>Disponibilité</small>
              </div>
            </div>
            
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowClearModal(true)}
            >
              <FiTrash2 className="me-1" />
              Effacer tout
            </button>
          </div>
        </div>
      </main>

      {/* Modal de suppression d'un événement */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDeleteEvent}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de suppression de tous les événements */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer toutes vos disponibilités ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmClearAll}>
            Tout supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .availability-badge {
          width: 15px;
          height: 15px;
          background-color: #4ade80;
          border-radius: 3px;
        }
        .fc-event {
          cursor: pointer;
          font-size: 0.85rem;
        }
        .fc-daygrid-event-dot {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Calendrier;