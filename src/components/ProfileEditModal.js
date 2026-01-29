import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAuthenticatedClient } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { OKTA_CHAPTERS } from '../constants/oktaChapters';
import { useLanguage } from '../context/LanguageContext';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: ${props => props.force ? 'none' : 'block'};
  
  &:hover {
    color: #333;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.$error ? 'red' : 'green'};
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const ProfileEditModal = ({ isOpen, onClose, force = false }) => {
  const { user, fetchUserProfile } = useAuth();
  const { language } = useLanguage();
  const isKo = language === 'ko';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    kakaotalk_id: '',
    is_okta_member: false,
    okta_chapter_country: '',
    okta_chapter_city: ''
  });

  const cities = formData.okta_chapter_country ? OKTA_CHAPTERS[formData.okta_chapter_country] || [] : [];

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const authClient = getAuthenticatedClient();
      const { data, error } = await authClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          kakaotalk_id: data.kakaotalk_id || '',
          is_okta_member: data.is_okta_member || false,
          okta_chapter_country: data.okta_chapter_country || '',
          okta_chapter_city: data.okta_chapter_city || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Don't show error to user, just let them enter new data
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'okta_chapter_country') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        okta_chapter_city: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const authClient = getAuthenticatedClient();
      const { error } = await authClient
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date()
        });

      if (error) throw error;

      setMessage(isKo ? '프로필이 성공적으로 업데이트되었습니다.' : 'Your profile has been updated successfully.');
      
      // Update local profile state
      await fetchUserProfile(user.id);

      setTimeout(() => {
        if (!force) {
          onClose();
        } else {
          setMessage(null);
          window.location.reload(); 
        }
      }, 1000);
    } catch (err) {
      setMessage(err.message || (isKo ? '프로필 업데이트 중 오류가 발생했습니다.' : 'An error occurred while updating your profile.'));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (!force) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} force={force}>&times;</CloseButton>
        <Title>
          {force
            ? (isKo ? '회원가입 완료를 위해 정보를 입력해주세요' : 'Please complete your profile to continue')
            : (isKo ? '내 정보 수정' : 'Edit Profile')}
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{isKo ? '이름 (Full Name)' : 'Full Name'}</Label>
            <Input
              name="full_name"
              placeholder={isKo ? '홍길동' : 'Your name'}
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{isKo ? '핸드폰 번호 (국가번호 포함)' : 'Phone Number (with country code)'}</Label>
            <Input
              name="phone_number"
              placeholder="+1 123-456-7890"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{isKo ? '카카오톡 ID' : 'KakaoTalk ID'}</Label>
            <Input
              name="kakaotalk_id"
              placeholder={isKo ? '카카오톡 ID 입력' : 'Enter your KakaoTalk ID'}
              value={formData.kakaotalk_id}
              onChange={handleChange}
            />
          </FormGroup>

          <CheckboxGroup>
            <input
              type="checkbox"
              id="is_okta_member"
              name="is_okta_member"
              checked={formData.is_okta_member}
              onChange={handleChange}
            />
            <Label htmlFor="is_okta_member" style={{ marginBottom: 0 }}>
              {isKo ? 'OKTA 정회원입니다' : 'I am an OKTA member'}
            </Label>
          </CheckboxGroup>

          {formData.is_okta_member && (
            <>
              <FormGroup>
                <Label>{isKo ? '소속 지회 (국가)' : 'Chapter Country'}</Label>
                <Select
                  name="okta_chapter_country"
                  value={formData.okta_chapter_country}
                  onChange={handleChange}
                  required={formData.is_okta_member}
                >
                  <option value="">{isKo ? '국가를 선택하세요' : 'Select a country'}</option>
                  {Object.keys(OKTA_CHAPTERS).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>{isKo ? '소속 지회 (도시)' : 'Chapter City'}</Label>
                <Select
                  name="okta_chapter_city"
                  value={formData.okta_chapter_city}
                  onChange={handleChange}
                  required={formData.is_okta_member}
                  disabled={!formData.okta_chapter_country}
                >
                  <option value="">
                    {formData.okta_chapter_country
                      ? (isKo ? '도시를 선택하세요' : 'Select a city')
                      : (isKo ? '국가를 먼저 선택하세요' : 'Select a country first')}
                  </option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </FormGroup>
            </>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (isKo ? '저장 중...' : 'Saving...') : (isKo ? '저장하기' : 'Save')}
          </Button>
        </Form>
        {message && <Message $error={isError}>{message}</Message>}
      </ModalContainer>
    </Overlay>
  );
};

export default ProfileEditModal;
