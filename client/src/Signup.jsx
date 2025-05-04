import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from 'validator';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!validator.isEmail(email)) newErrors.email = "Invalid email format";
    if (!validator.isStrongPassword(password, {
      minLength: 6,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) newErrors.password = "Password must contain: 6+ chars, 1 uppercase, 1 number, 1 symbol";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3001/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      navigate('/');
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.error || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <h1>Signup Form</h1>
      <div className="bg-white p-3 rounded w-50">
        <h2>Register</h2>
        {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name"><strong>Name</strong></label>
            <input type="text" id="name" className="form-control"
              value={name} onChange={(e) => setName(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, name: null }))} />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" id="email" className="form-control"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, email: null }))} />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" id="password" className="form-control"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, password: null }))} />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="mt-3">Already have an account?</p>
        <Link to="/" className="btn btn-outline-secondary w-100">Login</Link>
      </div>
    </div>
  );
}

export default SignUp; 