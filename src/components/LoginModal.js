import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
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
  font-size: 0.9rem;
  color: ${props => props.$error ? 'red' : 'green'};
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

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #0b5ed7;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginModal = ({ isOpen, onClose, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [view, setView] = useState('login');
  const { signInWithEmail } = useAuth();
  const { language } = useLanguage();
  const isKo = language === 'ko';
  
  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      await signInWithEmail(email, password);
      onClose(); // 로그인 성공 시 모달 닫기
    } catch (err) {
      setMessage(err.message || (isKo ? '로그인 중 오류가 발생했습니다.' : 'An error occurred during login.'));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail) {
      setMessage(isKo ? '이메일을 입력해주세요.' : 'Please enter your email.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, { redirectTo });
      if (error) throw error;

      setMessage(
        isKo
          ? '비밀번호 재설정 링크를 이메일로 발송했습니다. 이메일을 확인해주세요.'
          : 'We sent a password reset link to your email. Please check your inbox.'
      );
      setIsError(false);
    } catch (err) {
      setMessage(
        err.message || (isKo ? '비밀번호 재설정 링크 발송 중 오류가 발생했습니다.' : 'An error occurred while sending the reset link.')
      );
      setIsError(true);
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
      setMessage(err.message || (isKo ? 'Google 로그인 중 오류가 발생했습니다.' : 'An error occurred during Google login.'));
      setIsError(true);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>
          {view === 'login'
            ? (isKo ? '로그인' : 'Login')
            : (isKo ? '비밀번호 재설정' : 'Reset Password')}
        </Title>

        {view === 'login' ? (
          <>
            <Form onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder={isKo ? '이메일' : 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder={isKo ? '비밀번호' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LinkButton
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setMessage(null);
                    setIsError(false);
                  }}
                >
                  {isKo ? '비밀번호를 잊으셨나요?' : 'Forgot password?'}
                </LinkButton>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (isKo ? '로그인 중...' : 'Logging in...') : (isKo ? '로그인' : 'Login')}
              </Button>
            </Form>

            <Divider>{isKo ? '또는' : 'OR'}</Divider>

            <GoogleButton type="button" onClick={handleGoogleLogin}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{width: '20px'}} />
              {isKo ? 'Google로 로그인' : 'Continue with Google'}
            </GoogleButton>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                {isKo ? '계정이 없으신가요?' : "Don't have an account?"}
              </p>
              <Button 
                type="button" 
                onClick={onSignUpClick}
                style={{ backgroundColor: '#6c757d', width: '100%' }}
              >
                {isKo ? '회원가입' : 'Sign Up'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Form onSubmit={handleSendResetLink}>
              <Input
                type="email"
                placeholder={isKo ? '이메일' : 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading
                  ? (isKo ? '발송 중...' : 'Sending...')
                  : (isKo ? '재설정 링크 보내기' : 'Send reset link')}
              </Button>
            </Form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <LinkButton
                type="button"
                onClick={() => {
                  setView('login');
                  setMessage(null);
                  setIsError(false);
                }}
              >
                {isKo ? '로그인으로 돌아가기' : 'Back to login'}
              </LinkButton>
            </div>
          </>
        )}

        {message && <Message $error={isError}>{message}</Message>}
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;
