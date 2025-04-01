import React, { useState, useEffect } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleIdentifierChange = (e) => setIdentifier(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            nav('/');
        }
    }, [nav]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        Axios.post('http://localhost:5000/login', {
            identifier: identifier,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "Invalid credentials.");
            } else {
                localStorage.setItem('token', response.data.token);
                nav("/"); // Navigate to home page
            }
        }).catch(() => {
            setLoading(false);
            setError("Login failed. Please try again.");
        });
    };

    return (
        <div className="login-wrapper">
            {loading && <LoadingSpinner />}
            {!loading && (
                <div className="login-container">
                    <h2>Login</h2>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-container-login">
                            <input
                                type="text"
                                placeholder="Email or Username"
                                value={identifier}
                                onChange={handleIdentifierChange}
                                required
                            />
                        </div>
                        <div className="input-container-login">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <span
                                className="toggle-password-icon"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        <button type="submit" className="login-button">
                            Login
                        </button>
                        <div className="links-login">
                            <Link to="/forgot-password">Forgot Password?</Link> |
                            <Link to="/sign-up"> Sign up</Link>
                        </div>
                    </form>
                    <p className="welcome-message">Welcome back! Please log in to continue.</p>
                </div>
            )}
        </div>
    );
};

export default Login;
