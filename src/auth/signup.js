import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaUserPlus, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone_number: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    // Auto-fill implementation for username, email, phone number
    useEffect(() => {
        const savedData = localStorage.getItem('signupData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('signupData', JSON.stringify(formData));
    }, [formData]);

  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleTermsChange = (e) => setTermsAccepted(e.target.checked);

// Phone number validation to enforce 10, 12, 13, or 14-digit format, with optional '+'
const validatePhoneNumber = (phone) => {

};


    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        if (!termsAccepted) {
            setError('You must agree to the terms and conditions');
            return false;
        }
        if (!formData.email || !validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Please enter a password');
            return false;
        }
        if (!formData.phone_number) {
            setError('Phone number must be in the format +91XXXXXXXXXX');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Sign-up failed');
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);

            // Reset form
            setFormData({
                email: '',
                password: '',
                phone_number: '',
            });
            setTermsAccepted(false);
            setError(null);
            nav('/welcome');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


   const checkTokenAndRedirect = async (token) => {
        try {
            const response = await axios.post(API_ROUTES.sessionCheck, { token });
            if (response.data.exists) {
                nav('/');
            } else {
                console.error('No matching token found.');
            }
        } catch (error) {
            console.error('Error checking token:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkTokenAndRedirect(token);
        }
    }, [nav]);  

    return (
        <div className="signup-sign-up-page-card-main-div-signup">
          <div className="signup-sign-up-page-card">

           
 
            {loading && <LoadingSpinner />}
      
    
              <>
                <h2 className="signup-sign-up-page-heading">Create Your Doxsify Account</h2>
                <p className="signup-sign-up-page-subtext">
                  Welcome to Doxsify: Your AI-Powered Smart Task Manager!
                </p>
              </>
       

      
            <form onSubmit={handleSubmit} className="signup-sign-up-page-form">
              {error && <p className="signup-sign-up-page-error">{error}</p>}
  
                <>
                  <div className="signup-sign-up-page-input-group">
                    <FaEnvelope className="signup-sign-up-page-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="signup-sign-up-page-input"
                      autoComplete="email"
                      aria-label="Enter your email"
                    />
                  </div>
                  <div className="signup-sign-up-page-input-group">
                    <FaLock className="signup-sign-up-page-icon" />
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="signup-sign-up-page-input"
                      autoComplete="new-password"
                      aria-label="Enter your password"
                    />
                    <span
                      className="signup-sign-up-page-toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="signup-sign-up-page-input-group">
                    <FaPhone className="signup-sign-up-page-icon" />
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="signup-sign-up-page-input"
                      autoComplete="tel"
                      aria-label="Enter your phone number"
                    />
                  </div>
                </>
      
      
  
                <>

        
                  <div className="signup-sign-up-page-checkbox-container" style={{ marginTop: '20px' }}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                      required
                      className="signup-sign-up-page-checkbox"
                      aria-label="Accept Terms and Conditions"
                    />
                    <label htmlFor="terms" className="signup-sign-up-page-checkbox-label">
                      I agree to the <Link to="/terms" className="signup-sign-up-page-link" style={{ color: 'black' }}>Terms and Conditions</Link>
                    </label>
                  </div>
                </>
          

      
     
                <button type="submit" disabled={!termsAccepted} className="signup-sign-up-page-submit-button">
                  Sign Up
                </button>
     
            </form>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#333', marginTop: '20px' }}>
              Already have an account?
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                <Link to='/login' style={{ color: 'black' }}> Login</Link>
              </span>
            </p>
          </div>
        </div>
      );
      
};

export default SignUp;
