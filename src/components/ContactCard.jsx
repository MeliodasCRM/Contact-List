import React from 'react';
import '../styles/ContactCard.css';

const ContactCard = ({ contact, onDelete, onUpdate }) => {
  return (
    <div className="contact-card fade-in">
      <div className="contact-info">
        <h2>{contact.name}</h2>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
        {contact.address && <p>{contact.address}</p>}
      </div>
      <button className="edit-btn" onClick={() => onUpdate(contact)}>
        Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(contact.id)}>
        Delete
      </button>
    </div>
  );
};

export default ContactCard;