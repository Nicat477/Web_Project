import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateUser() {
  const [publisher, setPublisher] = useState('');
  const [book, setBook] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!publisher.trim()) newErrors.publisher = "Publisher is required";
    if (!book.trim()) newErrors.book = "Book name is required";
    if (!date) newErrors.date = "Date is required";
    else if (new Date(date) > new Date()) newErrors.date = "Date cannot be in the future";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3001/createUser', {
        publisher: publisher.trim(),
        book: book.trim(),
        date: date
      });
      navigate('/main');
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.error || 'Failed to create book. Please try again.'
      });
    }
  };

  return (
    <div className="page-container">
      <h1>Book Management System</h1>
      <div className="content-container">
        <div className="bg-white p-3 rounded w-75">
          <h2>Add Book</h2>
          {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pub">Publisher</label>
              <input type="text" id="pub" className="form-control"
                value={publisher} onChange={(e) => setPublisher(e.target.value)}
                onBlur={() => setErrors(prev => ({ ...prev, publisher: null }))} />
              {errors.publisher && <div className="text-danger small">{errors.publisher}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="book">Book Name</label>
              <input type="text" id="book" className="form-control"
                value={book} onChange={(e) => setBook(e.target.value)}
                onBlur={() => setErrors(prev => ({ ...prev, book: null }))} />
              {errors.book && <div className="text-danger small">{errors.book}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" className="form-control"
                value={date} onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                onBlur={() => setErrors(prev => ({ ...prev, date: null }))} />
              {errors.date && <div className="text-danger small">{errors.date}</div>}
            </div>
            <button className="btn btn-success w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;