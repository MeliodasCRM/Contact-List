import React, { useState, useEffect } from 'react';
import '../Home.css';

// Configuración de la API (se elimina la parte "/docs" de la URL)
const API_CONFIG = {
  baseUrl: 'https://playground.4geeks.com/contact',
  agendaId: 'Meliodas', // Se usará en el campo agenda_slug
};

// Componente del Formulario de Contacto
const ContactForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  // Si se está editando, separamos el full_name en nombre y apellido
  const initialName = initialData ? initialData.full_name.split(' ')[0] : '';
  const initialLastName = initialData
    ? initialData.full_name.split(' ').slice(1).join(' ')
    : '';
  const [formData, setFormData] = useState({
    name: initialName,
    lastName: initialLastName,
    phone: initialData ? initialData.phone : '',
    email: initialData ? initialData.email : '',
    address: initialData ? initialData.address : '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
    if (!formData.phone.trim())
      newErrors.phone = 'Teléfono es requerido';
    else if (!/^\d{9,}$/.test(formData.phone.trim()))
      newErrors.phone = 'Teléfono debe tener al menos 9 dígitos';
    if (!formData.email.trim())
      newErrors.email = 'Email es requerido';
    if (!formData.address.trim())
      newErrors.address = 'Dirección es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({
          name: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Nombre"
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Apellido"
        />
        {errors.lastName && (
          <div className="invalid-feedback">{errors.lastName}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          placeholder="Teléfono"
        />
        {errors.phone && (
          <div className="invalid-feedback">{errors.phone}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="Email"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Dirección"
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Actualizar' : 'Añadir'} Contacto
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

// Componente para mostrar cada Contacto
const ContactItem = ({ contact, onEdit, onDelete, onToggleFavorite }) => (
  <li className="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <h6 className="mb-0">{contact.full_name}</h6>
      <small className="text-muted">{contact.phone}</small>
    </div>
    <div className="btn-group">
      <button
        onClick={() => onToggleFavorite(contact)}
        className="btn btn-outline-secondary"
      >
        {contact.isFavorite ? '❤️' : '🤍'}
      </button>
      <button
        onClick={() => onEdit(contact)}
        className="btn btn-outline-primary"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(contact.id)}
        className="btn btn-outline-danger"
      >
        Eliminar
      </button>
    </div>
  </li>
);

// Componente Principal
const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  // Se carga la lista de contactos al montar el componente
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos el endpoint para obtener solo los contactos de la agenda "Meliodas"
      const response = await fetch(
        `${API_CONFIG.baseUrl}/agenda/${API_CONFIG.agendaId}`
      );
      if (!response.ok)
        throw new Error('Error al cargar los contactos');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setError(
        'No se pudieron cargar los contactos. Por favor, intente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (contactData) => {
    setLoading(true);
    setError(null);
    try {
      // Crear un nuevo contacto
      const response = await fetch(`${API_CONFIG.baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: `${contactData.name} ${contactData.lastName}`,
          email: contactData.email,
          phone: contactData.phone,
          address: contactData.address,
          agenda_slug: API_CONFIG.agendaId,
          isFavorite: false,
        }),
      });
      if (!response.ok)
        throw new Error('Error al añadir el contacto');
      await loadContacts();
    } catch (error) {
      setError(
        'No se pudo añadir el contacto. Por favor, intente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async (contactData) => {
    if (!editingContact) return;
    setLoading(true);
    setError(null);
    try {
      // Actualizar el contacto
      const response = await fetch(
        `${API_CONFIG.baseUrl}/contact/${editingContact.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: `${contactData.name} ${contactData.lastName}`,
            email: contactData.email,
            phone: contactData.phone,
            address: contactData.address,
            agenda_slug: API_CONFIG.agendaId,
            isFavorite: editingContact.isFavorite,
          }),
        }
      );
      if (!response.ok)
        throw new Error('Error al actualizar el contacto');
      await loadContacts();
      setEditingContact(null);
    } catch (error) {
      setError(
        'No se pudo actualizar el contacto. Por favor, intente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (
      !window.confirm(
        '¿Está seguro de que desea eliminar este contacto?'
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      // Eliminar el contacto
      const response = await fetch(
        `${API_CONFIG.baseUrl}/contact/${id}`,
        { method: 'DELETE' }
      );
      if (!response.ok)
        throw new Error('Error al eliminar el contacto');
      await loadContacts();
    } catch (error) {
      setError(
        'No se pudo eliminar el contacto. Por favor, intente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (contact) => {
    setLoading(true);
    setError(null);
    try {
      // Actualizar el estado de favorito del contacto
      const response = await fetch(
        `${API_CONFIG.baseUrl}/contact/${contact.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: contact.full_name,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
            agenda_slug: API_CONFIG.agendaId,
            isFavorite: !contact.isFavorite,
          }),
        }
      );
      if (!response.ok)
        throw new Error('Error al actualizar el contacto');
      await loadContacts();
    } catch (error) {
      setError(
        'No se pudo actualizar el contacto. Por favor, intente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {editingContact ? 'Editar Contacto' : 'Añadir un Contacto'}
              </h2>
              <ContactForm
                onSubmit={
                  editingContact ? handleUpdateContact : handleAddContact
                }
                initialData={editingContact}
                onCancel={
                  editingContact ? () => setEditingContact(null) : null
                }
              />
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Lista de Contactos</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}

              {!loading && contacts.length === 0 && (
                <p className="text-center text-muted py-4">
                  No hay contactos para mostrar.
                </p>
              )}

              {!loading && contacts.length > 0 && (
                <ul className="list-group">
                  {contacts.map((contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      onEdit={setEditingContact}
                      onDelete={handleDeleteContact}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
