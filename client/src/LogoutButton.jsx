// src/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post('http://localhost:3001/logout')
      .then(() => {
        // Redirect back to login page
        navigate('/');
      })
      .catch((err) => {
        console.error('Logout failed', err);
      });
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Logout
    </button>
  );
}
