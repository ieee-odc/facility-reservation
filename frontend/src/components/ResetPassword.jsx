import React, { useState } from "react";
import { MdLockOutline, MdEmail, MdPhone } from "react-icons/md";
import "./styles.css";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Choose method, Step 2: Enter contact, Step 3: Enter code, Step 4: Reset password
  const [method, setMethod] = useState(""); // "email" or "phone"
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setStep(2);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Send the confirmation code to the provided contact (email or phone)
    setStep(3);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    // Verify the code here, then proceed to reset password
    setStep(4);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Handle password reset logic here
  };

  return (
    <div className="login-container">
      <h2>Reset password</h2>
      <form className="form-container">
        {step === 1 && (
          <div className="inputs-container">
            <button
              type="button"
              className="login-submit-button login-buttons"
              onClick={() => handleMethodChange("email")}
            >
              Reset via Email
            </button>
            <button
              type="button"
              className="login-submit-button login-buttons"
              onClick={() => handleMethodChange("phone")}
            >
              Reset via Phone
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="inputs-container">
            <div className="input-container">
              <div className="icon-box">
                {method === "email" ? (
                  <MdEmail className="input-icon" />
                ) : (
                  <MdPhone className="input-icon" />
                )}
                <input
                  type={method === "email" ? "email" : "tel"}
                  placeholder={method === "email" ? "Email Address" : "Phone Number"}
                  required
                  className="input-with-icon"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>
            <button
              className="login-submit-button login-buttons"
              type="submit"
              onClick={handleContactSubmit}
            >
              Submit
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="inputs-container">
            <div className="input-container">
              <div className="icon-box">
                <input
                  type="text"
                  placeholder="Confirmation Code"
                  required
                  className="input-with-icon"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <button
              className="login-submit-button login-buttons"
              type="submit"
              onClick={handleCodeSubmit}
            >
              Submit Code
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="inputs-container">
            <div className="input-container">
              <div className="icon-box">
                <MdLockOutline className="input-icon" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="input-with-icon"
                />
              </div>
            </div>
            <button
              className="login-submit-button login-buttons"
              type="submit"
              onClick={handlePasswordReset}
            >
              Reset Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
