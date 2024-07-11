import React, { useState } from "react";
//import { FaBug, FaEnvelopeOpenText, FaRoom } from "react-icons/fa";
import "./feedback.css";

const GiveFeedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here, such as sending the feedback to the server
    console.log("Feedback submitted:", { feedbackType, message });
  };

  return (
    <div className="feedback-container">
      <h2>Give Feedback</h2>
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
            <option value="room">Other</option>

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
  );
};

export default GiveFeedback;
