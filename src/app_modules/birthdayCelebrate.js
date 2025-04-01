import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './birthdayCelebration.css';
import { API_ROUTES } from './apiRoutes';

const BirthdayCelebration = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [userName, setUserName] = useState('');
  const [userBirthday, setUserBirthday] = useState('');
  const [isBirthday, setIsBirthday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile data from API
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setUserName(data.unique_id);
        setUserBirthday(data.birthday); // Assuming the birthday is in 'YYYY-MM-DD' format

        // If user hasn't entered their birthday, skip showing modal
        if (!data.birthday) {
          setLoading(false);
          return;
        }

        // Check if today is the user's birthday
        const today = new Date();
        const userBirthdayDate = new Date(data.birthday); // Parse the birthday string
        if (userBirthdayDate.getDate() === today.getDate() && userBirthdayDate.getMonth() === today.getMonth()) {
          setIsBirthday(true); // Set flag to true if today is the user's birthday
        }

        // Check if the modal has already been shown today
        const birthdayShown = localStorage.getItem('birthdayShown');
        if (isBirthday && !birthdayShown) {
          setShowCelebration(true); // Show the celebration modal if it's their birthday
          localStorage.setItem('birthdayShown', 'true'); // Set the localStorage flag
        }

        setLoading(false);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isBirthday]); // Rerun this useEffect when the birthday flag changes

  // Close the celebration modal
  const handleCloseModal = () => {
    setShowCelebration(false);
    // Optionally reset the flag after some time
    localStorage.removeItem('birthdayShown'); // Reset the birthdayShown flag for next year
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
     {showCelebration && (
   <div className="birthday__celeb__page__modal">
  <div className="birthday__celeb__page__modal__content">
    {/* Balloons and Confetti */}
    <div className="balloons-and-confetti">
      {/* Balloons */}
      <div className="balloon balloon-1"></div>
      <div className="balloon balloon-2"></div>
      <div className="balloon balloon-3"></div>

      {/* Confetti */}
      <div className="confetti"></div>
    </div>

    {/* Birthday Cake SVG */}
    <div className="svg-container__birthDay_modal__page">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="svg__birthDay_modal__page">
        {/* Cake Body */}
        <rect x="20" y="50" width="60" height="30" fill="#ffedd5" rx="5" />
        <rect x="25" y="45" width="50" height="10" fill="#fca5a5" rx="3" />

        {/* Candles */}
        <circle cx="35" cy="40" r="3" fill="#fde68a" />
        <circle cx="50" cy="40" r="3" fill="#fde68a" />
        <circle cx="65" cy="40" r="3" fill="#fde68a" />

        {/* Candle Flame */}
        <rect x="48" y="20" width="4" height="15" fill="#fde047" />
        <polygon points="50,18 47,20 53,20" fill="#f87171" />
      </svg>
    </div>

    {/* Personalized Birthday Message */}
    <div className="birthday__celeb__page__modal__message">
      <h2 className="celebration__title">Happy Birthday, {userName}!</h2>
      <p className="celebration__text">Wishing you an amazing day full of happiness!</p>
      <p className="celebration__text">Don't forget to smile!</p>
    </div>

    {/* Close button */}
    <div className="birthday__celeb__page__modal__buttons">
      <button className="reward-btn__thank__you__birthday__btn" onClick={handleCloseModal}>
      <span className="IconContainer__thank__you__birthday__btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 60 20"
          className="box-top__thank__you__birthday__btn box__thank__you__birthday__btn"
        >
          <path
            stroke-linecap="round"
            stroke-width="4"
            stroke="#6A8EF6"
            d="M2 18L58 18"
          ></path>
          <circle
            stroke-width="5"
            stroke="#6A8EF6"
            fill="#101218"
            r="7"
            cy="9.5"
            cx="20.5"
          ></circle>
          <circle
            stroke-width="5"
            stroke="#6A8EF6"
            fill="#101218"
            r="7"
            cy="9.5"
            cx="38.5"
          ></circle>
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 58 44"
          className="box-body__thank__you__birthday__btn box__thank__you__birthday__btn"
        >
          <mask fill="white" id="path-1-inside-1_81_19">
            <rect rx="3" height="44" width="58"></rect>
          </mask>
          <rect
            mask="url(#path-1-inside-1_81_19)"
            stroke-width="8"
            stroke="#6A8EF6"
            fill="#101218"
            rx="3"
            height="44"
            width="58"
          ></rect>
          <line
            stroke-width="6"
            stroke="#6A8EF6"
            y2="29"
            x2="58"
            y1="29"
            x1="-3.61529e-09"
          ></line>
          <path
            stroke-linecap="round"
            stroke-width="5"
            stroke="#6A8EF6"
            d="M45.0005 20L36 3"
          ></path>
          <path
            stroke-linecap="round"
            stroke-width="5"
            stroke="#6A8EF6"
            d="M21 3L13.0002 19.9992"
          ></path>
        </svg>

        <span className="coin__thank__you__birthday__btn"></span>
      </span>
      <span className="text__thank__you__birthday__btn">Thank You!</span>
    </button>
    </div>
  </div>
</div>

      
      )}
    </>
  );
};

export default BirthdayCelebration;
