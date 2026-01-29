import styled from 'styled-components';

export const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

export const AdminHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  
  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

export const AdminForm = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #34495e;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
    
    &:focus {
      border-color: #3498db;
      outline: none;
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

export const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  p {
    color: #aaa;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #2980b9, #1f4e79);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #fadbd8;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  color: #27ae60;
  background: #d5f5e3;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const CancelButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 0.5rem;
  
  &:hover {
    background: #7f8c8d;
  }
`;

export const EventListContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto 0;
`;

export const EventListHeader = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EventItem = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const EventInfo = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
  }
  
  .date {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
  
  .badge {
    display: inline-block;
    background: #3498db;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.edit {
    background: #f39c12;
    color: white;
    
    &:hover {
      background: #d68910;
    }
  }
  
  &.delete {
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
    }
  }
`;
