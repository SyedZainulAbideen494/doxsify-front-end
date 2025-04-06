import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="homepage">
      <h1 className="homepage__greeting">👋 {greeting}!</h1>
      <h2 className="homepage__subtext">How can I assist you today?</h2>

      <div className="homepage__boxes">
        <div className="box ai">
          <h3 className="box__title">AI Assistant</h3>
        </div>
        <div className="box details">
          <h3 className="box__title">My Details</h3>
        </div>
        <div className="box plan">
          <h3 className="box__title">My Plan</h3>
        </div>
        <div className="box data">
          <h3 className="box__title">My Data</h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
