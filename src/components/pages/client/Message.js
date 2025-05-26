import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiUser, FiSearch } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import { format } from 'timeago.js';
import '../../../assets/css/message.css';
const Message = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Données simulées
  const demoConversations = [
    {
      id: 1,
      participant: {
        id: 101,
        name: 'Marc Plomberie',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        profession: 'Plombier',
        online: true
      },
      lastMessage: {
        text: 'Je peux passer demain matin',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false
      },
      unreadCount: 2
    },
    {
      id: 2,
      participant: {
        id: 102,
        name: 'Électricité Pro',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        profession: 'Électricienne',
        online: false
      },
      lastMessage: {
        text: 'Voici le devis demandé',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true
      },
      unreadCount: 0
    }
  ];

  const demoMessages = {
    1: [
      {
        id: 1,
        sender: 101,
        text: 'Bonjour, comment puis-je vous aider?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        attachments: []
      },
      {
        id: 2,
        sender: 'currentUser',
        text: "J'ai une fuite sous l'évier",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        attachments: []
      },
      {
        id: 3,
        sender: 101,
        text: 'Je peux passer demain matin',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        attachments: []
      }
    ],
    2: [
      // Messages pour la conversation 2...
    ]
  };

  useEffect(() => {
    // Simulation de chargement des conversations
    setConversations(demoConversations);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      // Simulation de chargement des messages
      setMessages(demoMessages[activeConversation.id] || []);
      scrollToBottom();
    }
  }, [activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 'currentUser',
      text: newMessage,
      timestamp: new Date(),
      attachments: []
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulation de réponse automatique
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: activeConversation.participant.id,
        text: 'Merci pour votre message, je vous réponds rapidement!',
        timestamp: new Date(),
        attachments: []
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);

    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messaging-container">
      {/* Sidebar des conversations */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <div className="header-actions">
            <IoMdNotifications className="notification-icon" />
          </div>
        </div>

        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conv)}
            >
              <div className="avatar-container">
                <img src={conv.participant.avatar} alt={conv.participant.name} />
                {conv.participant.online && <span className="online-badge"></span>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h4>{conv.participant.name}</h4>
                  <span className="timestamp">{format(conv.lastMessage.timestamp)}</span>
                </div>
                <p className="last-message">{conv.lastMessage.text}</p>
                {conv.unreadCount > 0 && (
                  <span className="unread-count">{conv.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de conversation active */}
      {activeConversation ? (
        <div className="conversation-area">
          <div className="conversation-header">
            <div className="user-info">
              <img src={activeConversation.participant.avatar} alt={activeConversation.participant.name} />
              <div>
                <h3>{activeConversation.participant.name}</h3>
                <p className="profession">{activeConversation.participant.profession}</p>
                <p className="status">
                  {activeConversation.participant.online ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'currentUser' ? 'sent' : 'received'}`}
              >
                {msg.sender !== 'currentUser' && (
                  <img src={activeConversation.participant.avatar} alt="User" className="message-avatar" />
                )}
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{format(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-area">
            <button className="attachment-btn">
              <FiPaperclip />
            </button>
            <textarea
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button className="send-btn" onClick={handleSendMessage}>
              <FiSend />
            </button>
          </div>
        </div>
      ) : (
        <div className="no-conversation-selected">
          <div className="empty-state">
            <FiUser className="icon" />
            <h3>Sélectionnez une conversation</h3>
            <p>Ou commencez une nouvelle discussion avec un professionnel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;