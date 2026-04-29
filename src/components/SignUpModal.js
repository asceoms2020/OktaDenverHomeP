import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
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
  align-items: flex-start;
  overflow-y: auto;
  padding: 2rem 1rem;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin: auto;
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
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: ${props => props.$error ? '#ffe6e6' : '#e6ffe6'};
  color: ${props => props.$error ? '#cc0000' : '#006600'};
  border: 1px solid ${props => props.$error ? '#ff9999' : '#99ff99'};
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
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const { language } = useLanguage();
  const isKo = language === 'ko';

  if (!isOpen) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(false);

    // Check password confirmation
    if (password !== confirmPassword) {
      setMessage(isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.');
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Check if user already exists (Supabase returns empty identities for existing users)
      if (data?.user?.identities?.length === 0) {
        setMessage(
          isKo
            ? '이미 가입된 계정입니다. 로그인을 시도해주세요.'
            : 'This email is already registered. Please try logging in.'
        );
        setError(true);
        return;
      }

      // Profile creation happens after email confirmation via ProfileEditModal
      setMessage(
        isKo
          ? '회원가입 확인 메일을 발송했습니다. 이메일을 확인해주세요.'
          : "We've sent a confirmation email. Please check your inbox."
      );
      setError(false);
    } catch (err) {
      console.error('SignUp error:', err);
      setMessage(
        err.message || (isKo ? '회원가입 중 오류가 발생했습니다.' : 'An error occurred during sign up.')
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      setMessage(
        err.message || (isKo ? 'Google 로그인 중 오류가 발생했습니다.' : 'An error occurred during Google sign-in.')
      );
      setError(true);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{isKo ? '회원가입' : 'Sign Up'}</Title>
        <Form onSubmit={handleSignUp}>
          <FormGroup>
            <Label>{isKo ? '이메일' : 'Email'}</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{isKo ? '비밀번호' : 'Password'}</Label>
            <Input
              type="password"
              placeholder={isKo ? '6자 이상 입력해주세요' : 'Minimum 6 characters'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </FormGroup>

          <FormGroup>
            <Label>{isKo ? '비밀번호 확인' : 'Confirm Password'}</Label>
            <Input
              type="password"
              placeholder={isKo ? '비밀번호를 다시 입력해주세요' : 'Enter password again'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={confirmPassword && password !== confirmPassword ? { borderColor: '#cc0000' } : {}}
            />
            {confirmPassword && password !== confirmPassword && (
              <span style={{ color: '#cc0000', fontSize: '0.8rem' }}>
                {isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.'}
              </span>
            )}
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? (isKo ? '처리중...' : 'Signing up...') : (isKo ? '가입하기' : 'Sign Up')}
          </Button>
          
          {message && <Message $error={error}>{message}</Message>}
        </Form>

        <Divider>{isKo ? '또는' : 'OR'}</Divider>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{width: '20px'}} />
          {isKo ? 'Google로 회원가입' : 'Continue with Google'}
        </GoogleButton>
      </ModalContainer>
    </Overlay>
  );
};

export default SignUpModal;
