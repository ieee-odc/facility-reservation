import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./feedback.css";
import Navbar from "./navbar";

const GiveFeedback = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const email = localStorage.getItem('userEmail');

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    const feedbackData = { email, feedbackType, message };

    try {
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success(feedbackType === "bug" ? "Bug report sent to developers." : "Thank you for your feedback.");
        onClose();  // Close the modal after successful submission
      } else {
        const errorData = await response.json();
        toast.error("Failed to submit feedback: " + (errorData.message || 'Unknown error.'));
      }
    } catch (error) {
      toast.error("An error occurred while submitting your feedback.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Give Feedback</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedbackType">Feedback Type</label>
            <select
              id="feedbackType"
              value={feedbackType}
              onChange={handleFeedbackTypeChange}
              required
            >
              <option value="">Select Feedback Type</option>
              <option value="bug">Report a Bug</option>
              <option value="management">Management Issue</option>
              <option value="room">Room Problem</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              rows="5"
              placeholder="Enter your feedback message here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GiveFeedback;
