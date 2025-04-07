import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import './ResetPassword.css'

const ResetPassword = () => {
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(API_ROUTES.doxsifyResetPassword, {
        token,
        password,
      });
      setMessage(res.data.message);
      setTimeout(() => nav("/sign-in"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="reset-password__doxsify">
  <form onSubmit={handleReset}>
    <h2>Reset Your Password</h2>
    <input
      type="password"
      placeholder="New Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <input
      type="password"
      placeholder="Confirm Password"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
    />
    <button type="submit">Reset Password</button>
    {message && <p className="success__doxsify">{message}</p>}
    {error && <p className="error__doxsify">{error}</p>}
  </form>
</div>

  );
};

export default ResetPassword;
