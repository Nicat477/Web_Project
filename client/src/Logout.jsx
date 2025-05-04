import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Use the context logout function
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
}

export default Logout;