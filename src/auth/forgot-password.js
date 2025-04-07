import { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

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
      <h2>Forgot your password?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter email or phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="success__doxsify">{message}</p>}
      {error && <p className="error__doxsify">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
