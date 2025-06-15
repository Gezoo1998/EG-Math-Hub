import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import FloatingShapes from '../components/Layout/FloatingShapes';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative">
      <FloatingShapes />
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;