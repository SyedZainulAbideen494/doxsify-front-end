import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './forgot-password.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
{/*Submitiing the forgotpassword */}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
{/*If the email or phone number is blank */}
    if (!emailOrPhone) {
      setError('Please enter your email or phone number.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(API_ROUTES.forgotPassword, { emailOrPhone });
      setMessage('Instructions have been sent to your email.');
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password__card">
        <header className="forgot-password__header">
          <h1 className="forgot-password__title">Forgot Password</h1>
          <p className="forgot-password__subtitle">Don’t worry! We’ll help you reset it.</p>
        </header>
        <main className="forgot-password__main">
          <form className="forgot-password__form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="forgot-password__input"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Enter your email or phone number"
              required
            />
            <button
              className="forgot-password__button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          {error && <p className="forgot-password__message error-message">{error}</p>}
          {message && <p className="forgot-password__message">{message}</p>}
        </main>
        <footer className="forgot-password__footer">
          <Link className="forgot-password__link" to="/login">Back to Login</Link>
          <p>&copy; 2024 Edusify</p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
