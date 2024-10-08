import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { MdOutlineEmail } from "react-icons/md";


const ResetPassword = () => {
  const [contact, setContact] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, contact);

      navigate('/login', { state: { myProp: 'Password reset request processed. Please check your email for instructions.' } });
    } catch (error) {
      console.error(error);
      alert('Failed to send password reset email. Please check the contact information.');
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <form className="form-container" onSubmit={handleContactSubmit}>
        <div className="inputs-container">
          <div className="input-container">
            <div className="icon-box">
              <MdOutlineEmail 
className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="input-with-icon"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
          <button className="login-submit-button login-buttons" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
