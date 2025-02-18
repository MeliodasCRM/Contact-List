import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AddContact.css';

const AddContact = ({ addContact, updateContact }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const contactToEdit = location.state?.contact || null;

  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (contactToEdit) {
      setContact(contactToEdit);
    }
  }, [contactToEdit]);

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let success;
      if (contactToEdit) {
        success = await updateContact(contact);
      } else {
        success = await addContact(contact);
      }
      
      if (success) {
        // Agregamos un pequeño delay para asegurar que los datos se actualicen
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container fade-in">
      <h1>{contactToEdit ? 'Update Contact' : 'Add Contact'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={contact.address || ''}
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn" type="submit">
          {contactToEdit ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddContact;