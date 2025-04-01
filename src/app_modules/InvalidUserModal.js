import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InvalidUserModal.css';
import SuccessModal from './SuccessModal'; // Import the SuccessModal
import { API_ROUTES } from './apiRoutes';

const InvalidPhoneEmail = () => {
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Check user details on load
  useEffect(() => {
    const checkUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.post(API_ROUTES.noDetailPopModalcheck, { token });
        const { emailMissing, phoneMissing } = response.data;

        if (emailMissing || phoneMissing) {
          const fields = [];
          if (emailMissing) fields.push('email');
          if (phoneMissing) fields.push('phone');
          setMissingFields(fields);
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    checkUserDetails();
  }, []);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    // Check for missing required fields
    if ((missingFields.includes('email') && email.trim() === '') && 
        (missingFields.includes('phone') && phone.trim() === '')) {
      alert('Please fill out at least one of the required fields.');
      return;
    }
  
    const payload = { token };
  
    // Only include fields that are not empty
    if (email.trim() !== '') payload.email = email.trim();
    if (phone.trim() !== '') payload.phone = phone.trim();
  
  
    try {
      await axios.post(API_ROUTES.noDetailsUpdateUser, payload);
      setShowModal(false);
      setSuccessMessage('Details updated successfully'); // Set success message
      setShowSuccessModal(true); // Show success modal

      // Hide the success modal after 2.5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2500); // 2.5 seconds in milliseconds
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update details. Please check your input.');
    }
  };
  
  return (
    <div className="app__container">
      {showModal && (
        <div className="modal__invalid__phone__email__user__modal">
          <div className="modal__content__invalid__phone__email__user__modal">
            <h2 className="modal__title__invalid__phone__email__user__modal">
              Please Update Your Information
            </h2>
            <p className="modal__info__invalid__phone__email__user__modal">
              We need your email and phone number because you have entered them blank. 
              When you log in next time, we will send an OTP to your email and WhatsApp, 
              so please enter both.
            </p>
            <form onSubmit={handleModalSubmit} className="modal__form__invalid__phone__email__user__modal">
              {missingFields.includes('email') && (
                <div className="input__group__invalid__phone__email__user__modal">
                  <label className="input__label__invalid__phone__email__user__modal">Email:</label>
                  <input
                    className="input__field__invalid__phone__email__user__modal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}
              {missingFields.includes('phone') && (
                <div className="input__group__invalid__phone__email__user__modal">
                  <label className="input__label__invalid__phone__email__user__modal">Phone Number:</label>
                  <input
                    className="input__field__invalid__phone__email__user__modal"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              )}
              <button type="submit" className="button__submit__invalid__phone__email__user__modal">Update</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      <SuccessModal visible={showSuccessModal} message={successMessage} />
    </div>
  );
};

export default InvalidPhoneEmail;
