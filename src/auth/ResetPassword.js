import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Add useNavigate hook
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(API_ROUTES.resetPassword, { token, password });
      setMessage('Password successfully reset.');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after 2 seconds
      }, 500);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__card">
        <header className="reset-password__header">
          <h1 className="reset-password__title">Reset Password</h1>
        </header>
        <main className="reset-password__main">
          <form className="reset-password__form" onSubmit={handleSubmit}>
            <input
              type="password"
              className="reset-password__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <input
              type="password"
              className="reset-password__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
            <button
              className="reset-password__button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          {error && <p className="reset-password__message error-message">{error}</p>}
          {message && <p className="reset-password__message">{message}</p>}
        </main>
        <footer className="reset-password__footer">
          <p>&copy; 2024 Edusify</p>
        </footer>
      </div>
    </div>
  );
};

export default ResetPassword;
