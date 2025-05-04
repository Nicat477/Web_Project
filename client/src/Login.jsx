import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import validator from 'validator';
import { useAuth } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!validator.isEmail(email)) newErrors.email = "Invalid email format";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      
      if (response.data.message === 'Login successful') {
        login(); // Use the context login function
        navigate('/main');
      }
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.error || 'Login failed. Please try again.'
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h1>Login Form</h1>
      <div className="bg-white p-3 rounded w-50">
        <h2>Login</h2>
        {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"><strong>Email</strong></label>
            <input 
              type="email" 
              id="email" 
              className="form-control"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, email: null }))} 
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
            <input 
              type="password" 
              id="password" 
              className="form-control"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, password: null }))} 
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>
          
          <button type="submit" className="btn btn-success w-100 mb-3">Login</button>
          
          <p className="text-center mb-2">Don't have an account?</p>
          <Link to="/register" className="btn btn-outline-secondary w-100">Sign Up</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;