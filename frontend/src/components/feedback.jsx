import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./feedback.css";
import Navbar from "./navbar";

const GiveFeedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const email = localStorage.getItem('userEmail');
  console.log("hello email",email);

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

      console.log('Response status:', response.status);

      if (response.ok) {
        if (feedbackType === "bug") {
          toast.success("Bug report sent to developers.");
        } else {
          toast.success("Thank you for your feedback.");
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to submit feedback:", errorData);
        toast.error("Failed to submit feedback: " + (errorData.message || 'Unknown error.'));
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred while submitting your feedback.");
    }
  };

  return (
    <div>
      <Navbar />
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
      <ToastContainer />
    </div>
  );
};

export default GiveFeedback;
