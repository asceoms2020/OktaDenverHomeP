import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Page = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin-top: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => (props.$error ? 'red' : 'green')};
`;

const ResetPassword = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isKo = language === 'ko';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!user) {
      setMessage(
        isKo
          ? '유효하지 않거나 만료된 링크입니다. 다시 비밀번호 재설정을 요청해주세요.'
          : 'This link is invalid or expired. Please request a new password reset link.'
      );
      setIsError(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage(isKo ? '비밀번호는 최소 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.');
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage(isKo ? '비밀번호가 성공적으로 변경되었습니다.' : 'Your password has been updated successfully.');
      setIsError(false);

      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (err) {
      setMessage(
        err.message || (isKo ? '비밀번호 변경 중 오류가 발생했습니다.' : 'An error occurred while updating your password.')
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>{isKo ? '비밀번호 재설정' : 'Reset Password'}</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>{isKo ? '새 비밀번호' : 'New Password'}</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={isKo ? '새 비밀번호를 입력해주세요' : 'Enter a new password'}
              required
              minLength={6}
            />
          </div>
          <div>
            <Label>{isKo ? '비밀번호 확인' : 'Confirm Password'}</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={isKo ? '비밀번호를 다시 입력해주세요' : 'Re-enter your new password'}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (isKo ? '변경 중...' : 'Updating...') : (isKo ? '비밀번호 변경' : 'Update Password')}
          </Button>
        </Form>

        {message && <Message $error={isError}>{message}</Message>}
      </Card>
    </Page>
  );
};

export default ResetPassword;
