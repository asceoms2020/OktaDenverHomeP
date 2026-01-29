import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { OKTA_CHAPTERS } from '../constants/oktaChapters';

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
  max-width: 400px;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
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

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;

  &:hover {
    background-color: #f5f5f5;
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
  
  &:hover {
    color: #333;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.error ? 'red' : 'green'};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666;
  font-size: 0.9rem;
  
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  &::before { margin-right: .5em; }
  &::after { margin-left: .5em; }
`;

const SignUpModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extended fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [kakaoId, setKakaoId] = useState('');
  const [isOktaMember, setIsOktaMember] = useState(false);
  const [chapterCountry, setChapterCountry] = useState('');
  const [chapterCity, setChapterCity] = useState('');
  
  // Update city options when country changes
  const cities = chapterCountry ? OKTA_CHAPTERS[chapterCountry] || [] : [];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        // 2. Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
            kakaotalk_id: kakaoId,
            is_okta_member: isOktaMember,
            okta_chapter_country: isOktaMember ? chapterCountry : null,
            okta_chapter_city: isOktaMember ? chapterCity : null,
            updated_at: new Date()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Note: User is created but profile might have failed.
          // We still consider signup successful but warn or handle accordingly.
        }
      }

      setMessage('회원가입 확인 메일을 발송했습니다. 이메일을 확인해주세요.');
      setError(false);
    } catch (err) {
      setMessage(err.message || '회원가입 중 오류가 발생했습니다.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // options: { redirectTo: window.location.origin } // Supabase Site URL 설정을 따름
      });
      if (error) throw error;
    } catch (err) {
      setMessage(err.message || 'Google 로그인 중 오류가 발생했습니다.');
      setError(true);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>회원가입</Title>
        <Form onSubmit={handleSignUp}>
          <FormGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="6자 이상 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </FormGroup>

          <FormGroup>
            <Label>이름 (Full Name)</Label>
            <Input
              type="text"
              placeholder="홍길동"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>핸드폰 번호 (국가번호 포함)</Label>
            <Input
              type="tel"
              placeholder="+1 123-456-7890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>카카오톡 ID (선택)</Label>
            <Input
              type="text"
              placeholder="카카오톡 ID"
              value={kakaoId}
              onChange={(e) => setKakaoId(e.target.value)}
            />
          </FormGroup>

          <CheckboxGroup>
            <input
              type="checkbox"
              id="signup_is_okta_member"
              checked={isOktaMember}
              onChange={(e) => setIsOktaMember(e.target.checked)}
            />
            <Label htmlFor="signup_is_okta_member" style={{ marginBottom: 0 }}>OKTA 정회원입니다</Label>
          </CheckboxGroup>

          {isOktaMember && (
            <>
              <FormGroup>
                <Label>소속 지회 (국가)</Label>
                <Select
                  value={chapterCountry}
                  onChange={(e) => {
                    setChapterCountry(e.target.value);
                    setChapterCity(''); // Reset city when country changes
                  }}
                  required={isOktaMember}
                >
                  <option value="">국가를 선택하세요</option>
                  {Object.keys(OKTA_CHAPTERS).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>소속 지회 (도시)</Label>
                <Select
                  value={chapterCity}
                  onChange={(e) => setChapterCity(e.target.value)}
                  required={isOktaMember}
                  disabled={!chapterCountry}
                >
                  <option value="">{chapterCountry ? '도시를 선택하세요' : '국가를 먼저 선택하세요'}</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </FormGroup>
            </>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? '처리중...' : '가입하기'}
          </Button>
        </Form>

        <Divider>또는</Divider>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{width: '20px'}} />
          Google로 회원가입
        </GoogleButton>

        {message && <Message error={error}>{message}</Message>}
      </ModalContainer>
    </Overlay>
  );
};

export default SignUpModal;
