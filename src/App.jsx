import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Contact from './views/Contact';
import AddContact from './views/AddContact';
import './styles/App.css';

const BASE_URL = 'https://playground.4geeks.com/contact';

function App() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const getAgendaContacts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/agendas/meliodas`);
      if (!response.ok) throw new Error('Failed to fetch agenda contacts');
      const data = await response.json();
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
    } catch (error) {
      console.error('Error fetching agenda contacts:', error);
      setContacts([]);
    }
  };

  const checkAndCreateAgenda = async () => {
    try {
      const getResponse = await fetch(`${BASE_URL}/agendas/meliodas`);
      
      if (!getResponse.ok) {
        const createResponse = await fetch(`${BASE_URL}/agendas/meliodas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: 'meliodas' })
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create agenda');
        }
        await getAgendaContacts();
      } else {
        const agendaData = await getResponse.json();
        setContacts(Array.isArray(agendaData.contacts) ? agendaData.contacts : []);
      }
    } catch (error) {
      console.error('Error checking/creating agenda:', error);
      setContacts([]);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/agendas/meliodas/contacts`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      await getAgendaContacts();
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    }
  };

  useEffect(() => {
    checkAndCreateAgenda();
  }, []);

  const addContact = async (contact) => {
    try {
      const response = await fetch(`${BASE_URL}/agendas/meliodas/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact)
      });

      if (!response.ok) throw new Error('Failed to create contact');
      
      await getAgendaContacts();
      return true;
    } catch (error) {
      console.error('Error creating contact:', error);
      return false;
    }
  };

  const updateContact = async (updatedContact) => {
    try {
      const response = await fetch(`${BASE_URL}/agendas/meliodas/contacts/${updatedContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact)
      });

      if (!response.ok) throw new Error('Failed to update contact');
      
      await getAgendaContacts();
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      return false;
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/agendas/meliodas/contacts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete contact');
      
      await getAgendaContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <nav>
        <Link to="/" className="nav-link">Contacts</Link>
        <Link to="/add" className="nav-link">Add Contact</Link>
      </nav>
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={<Contact contacts={contacts || []} deleteContact={deleteContact} />}
          />
          <Route
            path="/add"
            element={
              <AddContact
                addContact={addContact}
                updateContact={updateContact}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;