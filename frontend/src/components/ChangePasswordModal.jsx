import React, { useState } from 'react';
import { auth } from '../config/firebase-config';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import './ChangePasswordModal.css'; 

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do  not match');
      return;
    }      

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      const email = localStorage.getItem('userEmail');
      if (!email) {
        throw new Error('Email not found in local storage');
      }

      
      const userIdResponse = await fetch(`/api/get-user-id/${email}`);
      if (!userIdResponse.ok) {
        throw new Error('Failed to fetch user ID from MongoDB');
      }
      const { id: userId } = await userIdResponse.json();
      
     /* const response = await fetch(`http://localhost:5000/api/reservationInitiators/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password in MongoDB');
      }*/

      setSuccess('Password changed successfully');
      setError('');
      onClose(); 
    } catch (err) {
      setError('Unable to update password');
      setSuccess('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Change Password</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
