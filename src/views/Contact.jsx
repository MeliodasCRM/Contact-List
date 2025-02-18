import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactCard from '../components/ContactCard';
import '../styles/Contact.css';

const Contact = ({ contacts = [], deleteContact }) => {
  const navigate = useNavigate();

  const handleUpdate = (contact) => {
    navigate('/add', { state: { contact } });
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h1>Contacts</h1>
      </div>
      {(!contacts || contacts.length === 0) ? (
        <div className="empty-state">
          <p>No contacts found.</p>
        </div>
      ) : (
        contacts.map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDelete={deleteContact}
            onUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  );
};

export default Contact;