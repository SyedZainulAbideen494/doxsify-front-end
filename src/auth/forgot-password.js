import { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import './forgot-password.css'

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(API_ROUTES.doxsifyForgotPassword, { emailOrPhone });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
<div className="forgot-password__doxsify">
  <form onSubmit={handleSubmit}>
    <h2>Forgot your password?</h2>
    <input
      type="text"
      placeholder="Enter email or phone"
      value={emailOrPhone}
      onChange={(e) => setEmailOrPhone(e.target.value)}
    />
    <button type="submit">Send Reset Link</button>
    {message && <p className="success__doxsify">{message}</p>}
    {error && <p className="error__doxsify">{error}</p>}
  </form>
</div>

  );
};

export default ForgotPassword;
