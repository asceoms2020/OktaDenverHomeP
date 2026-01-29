import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  AdminContainer,
  AdminHeader,
  AdminForm,
  FormGroup,
  ImagePreview,
  SubmitButton,
  CancelButton,
  ErrorMessage,
  SuccessMessage,
  EventListContainer,
  EventListHeader,
  EventList,
  EventItem,
  EventInfo,
  ActionButtons,
  ActionButton
} from '../styles/Admin.styles';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    url: '',
    badge: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch events on mount
  useEffect(() => {
    if (user && isAdmin) {
      fetchEvents();
    }
  }, [user, isAdmin]);

  // Handle URL edit parameter
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && events.length > 0) {
      const eventToEdit = events.find(e => e.id === editId);
      if (eventToEdit) {
        handleEdit(eventToEdit);
      }
    }
  }, [searchParams, events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Protect the route
  if (!user) {
    return (
      <AdminContainer>
        <AdminHeader>
          <h1>Access Denied</h1>
          <p>Please log in to access the admin panel.</p>
        </AdminHeader>
      </AdminContainer>
    );
  }

  if (!isAdmin) {
    return (
      <AdminContainer>
        <AdminHeader>
          <h1>Unauthorized</h1>
          <p>You do not have permission to access this page.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            Current user: {user.email}
          </p>
        </AdminHeader>
      </AdminContainer>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      description: '',
      url: '',
      badge: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setError('');
    setSuccess('');
    // Clear URL param without reloading
    navigate('/admin', { replace: true });
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
      url: event.url || '',
      badge: event.badge || ''
    });
    setImagePreview(event.poster);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      setError(`Failed to delete event: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let posterUrl = imagePreview;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);

        posterUrl = publicUrl;
      }

      const eventData = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        url: formData.url,
        badge: formData.badge,
        poster: posterUrl,
        ...(editingId ? {} : { created_by: user.id })
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('Event updated successfully!');
      } else {
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData]);

        if (insertError) throw insertError;
        setSuccess('Event created successfully!');
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      console.error("Error saving event: ", err);
      setError(`Failed to save event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>Admin Dashboard</h1>
        <p>{editingId ? 'Edit Event' : 'Register a new event'}</p>
      </AdminHeader>

      <AdminForm onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <FormGroup>
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="date">Date (e.g., 12.20.2026 or 2026.12.20)</label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="badge">Badge (Optional, e.g., Registration Open)</label>
          <input
            type="text"
            id="badge"
            name="badge"
            value={formData.badge}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="url">Event URL (Optional)</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://..."
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="poster">Event Poster Image</label>
          <input
            type="file"
            id="poster"
            accept="image/*"
            onChange={handleImageChange}
            required={!editingId && !imagePreview}
          />
          {imagePreview && (
            <ImagePreview>
              <img src={imagePreview} alt="Preview" />
            </ImagePreview>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : (editingId ? 'Update Event' : 'Create Event')}
        </SubmitButton>
        
        {editingId && (
          <CancelButton type="button" onClick={resetForm}>
            Cancel Edit
          </CancelButton>
        )}
      </AdminForm>

      <EventListContainer>
        <EventListHeader>Existing Events</EventListHeader>
        <EventList>
          {events.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No events found.</p>
          ) : (
            events.map(event => (
              <EventItem key={event.id}>
                <EventInfo>
                  <h3>{event.title}</h3>
                  <div className="date">{event.date}</div>
                  {event.badge && <div className="badge">{event.badge}</div>}
                </EventInfo>
                <ActionButtons>
                  <ActionButton className="edit" onClick={() => handleEdit(event)}>
                    Edit
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDelete(event.id)}>
                    Delete
                  </ActionButton>
                </ActionButtons>
              </EventItem>
            ))
          )}
        </EventList>
      </EventListContainer>
    </AdminContainer>
  );
};

export default Admin;