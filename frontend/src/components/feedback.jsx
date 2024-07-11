import React, { useState } from "react";
import "./feedback.css";
import Navbar from "./navbar";

const GiveFeedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = { feedbackType, message };

    try {
      if (feedbackType === "bug") {
        // Send feedback to developers via email
        const response = await fetch('/api/feedback/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });
        if (response.ok) {
          alert("Bug report sent to developers.");
        } else {
          alert("Failed to send bug report.");
        }
      } else {
        // Store feedback in the database
        const response = await fetch('/api/feedback/store-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });
        if (response.ok) {
          alert("Thank you for your feedback.");
        } else {
          alert("Failed to store feedback.");
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback.");
    }
  };

  return (
    <div>
    <Navbar/>
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
    </div>
  );
};

export default GiveFeedback;
