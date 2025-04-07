import React from "react";
import Lottie from "lottie-react";
import successAnimation from "./tick.json";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  return (
    <div className="success-wrapper">
      <div className="glass-card">
        <Lottie animationData={successAnimation} loop={false} className="tick" />
        <h1 className="success-text">You're all set</h1>
        <p className="sub-text">Your payment was successful.</p>
        <button className="continue-btn" onClick={() => window.location.href = "/"}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
