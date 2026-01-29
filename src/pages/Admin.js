import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  AdminContainer,
  AdminHeader,
  AdminForm,
  FormGroup,
  ImagePreview,
  SubmitButton,
  ErrorMessage,
  SuccessMessage
} from '../styles/Admin.styles';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    url: '',
    badge: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Check if user is admin using isAdmin from context
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let posterUrl = '';

      // 1. Upload Image to Supabase Storage if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload
        const { error: uploadError } = await supabase.storage
          .from('events') // 'events' bucket must exist in Supabase
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);

        posterUrl = publicUrl;
      }

      // 2. Insert Event into Supabase Database
      const eventData = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        url: formData.url,
        badge: formData.badge,
        poster: posterUrl,
        created_by: user.id
        // created_at is usually auto-handled by Supabase, but you can pass it if needed
      };

      const { error: insertError } = await supabase
        .from('events') // 'events' table must exist in Supabase
        .insert([eventData]);

      if (insertError) {
        throw insertError;
      }

      setSuccess('Event created successfully!');
      setFormData({
        title: '',
        date: '',
        description: '',
        url: '',
        badge: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error("Error creating event: ", err);
      setError(`Failed to create event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>Admin Dashboard</h1>
        <p>Register a new event</p>
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
            required
          />
          {imagePreview && (
            <ImagePreview>
              <img src={imagePreview} alt="Preview" />
            </ImagePreview>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </SubmitButton>
      </AdminForm>
    </AdminContainer>
  );
};

export default Admin;
