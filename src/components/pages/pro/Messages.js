import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiSearch, FiPaperclip, FiSend, FiUser, FiClock } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      client: 'Marie Dupont',
      lastMessage: 'Bonjour, je suis intéressé par votre service...',
      time: '10:30',
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      client: 'Jean Martin',
      lastMessage: 'Merci pour le devis, je vous confirme...',
      time: 'Hier',
      unread: false,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      client: 'Sophie Leroy',
      lastMessage: 'Le rendez-vous est confirmé pour...',
      time: 'Lundi',
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ]);

  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler le chargement des messages
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // En production, vous enverriez le message à votre API ici
    console.log('Message envoyé:', message);
    setMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      

      {/* Contenu principal */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '50px' }}>
        <div className="border-bottom p-3 bg-light">
          <h4 className="mb-0 d-flex align-items-center">
            <FiMessageSquare className="me-2 text-primary" />
            Messagerie
          </h4>
        </div>

        <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
          {/* Liste des conversations */}
          <div className="conversation-list border-end" style={{ width: '350px', overflowY: 'auto' }}>
            <div className="p-3 border-bottom">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une conversation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item p-3 border-bottom d-flex align-items-center ${activeConversation?.id === conv.id ? 'bg-light' : ''}`}
                onClick={() => setActiveConversation(conv)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={conv.avatar}
                  alt={conv.client}
                  className="rounded-circle me-3"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{conv.client}</h6>
                    <small className="text-muted">
                      <FiClock className="me-1" />
                      {conv.time}
                    </small>
                  </div>
                  <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <span className="badge bg-primary rounded-pill ms-2">!</span>
                )}
              </div>
            ))}
          </div>

          {/* Zone de discussion */}
          {activeConversation && (
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
              {/* En-tête de la conversation */}
              <div className="conversation-header p-3 border-bottom d-flex align-items-center bg-light">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.client}
                  className="rounded-circle me-3"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <h5 className="mb-0">{activeConversation.client}</h5>
              </div>

              {/* Messages */}
              <div className="messages-container flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                {/* Exemple de message reçu */}
                <div className="message received mb-3">
                  <div className="message-content bg-white p-3 rounded">
                    <p className="mb-0">Bonjour, je suis intéressé par votre service de plomberie.</p>
                    <small className="text-muted d-block text-end mt-2">10:30 AM</small>
                  </div>
                </div>

                {/* Exemple de message envoyé */}
                <div className="message sent mb-3 text-end">
                  <div className="message-content bg-primary text-white p-3 rounded">
                    <p className="mb-0">Bonjour, merci pour votre intérêt. Quand souhaitez-vous que j'intervienne ?</p>
                    <small className="text-white-50 d-block text-end mt-2">10:32 AM</small>
                  </div>
                </div>
              </div>

              {/* Zone d'envoi de message */}
              <div className="message-input p-3 border-top">
                <div className="input-group">
                  <button className="btn btn-outline-secondary" type="button">
                    <FiPaperclip />
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Écrivez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSendMessage}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        .conversation-item:hover {
          background-color: #f8f9fa !important;
        }
        
        .message-content {
          max-width: 70%;
          display: inline-block;
        }
        
        .message.sent .message-content {
          margin-left: auto;
        }
        
        .message.received .message-content {
          margin-right: auto;
        }
        
        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 80px;
          }
          
          .flex-grow-1 {
            margin-left: 80px !important;
          }
          
          .conversation-list {
            width: 300px;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed;
            z-index: 1000;
            height: 100vh;
          }
          
          .conversation-list {
            width: 100%;
          }
          
          .messages-container {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 80px;
            left: 0;
            background-color: white;
            z-index: 1050;
            display: ${activeConversation ? 'block' : 'none'};
          }
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;