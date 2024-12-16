import React, { useState, useEffect } from 'react';
import '../Home.css';

function Home() {
  // Estados
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // API URL de jsonplaceholder
  const apiUrl = 'https://playground.4geeks.com/contact/docs';

  // Función para crear agenda
  const createAgenda = () => {
    fetch(`${apiUrl}/agendas/Meliodas`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Agenda creada con éxito');
          return response.json();
        } else {
          throw new Error('Error al crear la agenda');
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  // Efecto para crear la agenda al montar el componente
  useEffect(() => {
    createAgenda();
  }, []);

  // Función para cargar contactos
  const getContacts = () => {
    fetch(`${apiUrl}/agendas/Meliodas/contacts`)
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Error fetching contacts:', error));
  };

  // Efecto para cargar contactos al montar el componente
  useEffect(() => {
    getContacts();
  }, []);

  // Función para agregar un contacto
  const addContact = () => {
    if (!name || !lastName || !phone) {
      console.error('Por favor completa todos los campos.');
      return;
    }

    const newContact = {
      name,
      lastName,
      phone,
      isFavorite: false,
    };

    fetch(`${apiUrl}/agendas/Meliodas/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
      .then((response) => response.json())
      .then((data) => {
        setContacts((prevContacts) => [...prevContacts, data]);
        setName('');
        setLastName('');
        setPhone('');
      })
      .catch((error) => console.error('Error adding contact:', error));
  };

  // Función para eliminar un contacto
  const deleteContact = (id) => {
    fetch(`${apiUrl}/contacts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );
      })
      .catch((error) => console.error('Error deleting contact:', error));
  };

  // Función para marcar un contacto como favorito
  const toggleFavorite = (id) => {
    const contactToUpdate = contacts.find((contact) => contact.id === id);
    const updatedContact = {
      ...contactToUpdate,
      isFavorite: !contactToUpdate.isFavorite,
    };

    fetch(`${apiUrl}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    })
      .then((response) => response.json())
      .then((data) => {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === id ? data : contact
          )
        );
      })
      .catch((error) => console.error('Error updating contact:', error));
  };

  // Función para editar un contacto
  const editContact = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    setName(contactToEdit.name);
    setLastName(contactToEdit.lastName);
    setPhone(contactToEdit.phone);
    deleteContact(id); // Eliminar el contacto original antes de editarlo
  };

  return (
    <div className="container">
      <div className="box-30">
        <h2>Añadir un Contacto</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Apellido"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono"
        />
        <button onClick={addContact}>Añadir Contacto</button>
      </div>

      <div className="box-70">
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <div>
                <p>
                  {contact.name} {contact.lastName} - {contact.phone}
                </p>
                <button onClick={() => toggleFavorite(contact.id)}>
                  {contact.isFavorite ? '❤️' : '🤍'}
                </button>
                <button onClick={() => editContact(contact.id)}>Editar</button>
                <button onClick={() => deleteContact(contact.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
