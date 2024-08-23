import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './styles.css';
import {Divider} from 'rsuite';

// Ensure that the app element is set for accessibility
Modal.setAppElement('#root');

const UploadCSV = ({ isOpen, onRequestClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/reservationInitiators/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      console.log(response);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Upload CSV Modal"
      className="upload-csv-modal"
      overlayClassName="upload-csv-overlay"
    >
      <button onClick={onRequestClose} className="modal-close-button">x</button>
      <div className="upload-csv-content">
        <h3 className="modal-title">Add New Initiator</h3><br />
        <button className="user-button" onClick={() => alert('Add New Initiator')}>
          Add manually
        </button> 
   <Divider>OR</Divider>
        <input className='csv-input' type="file" accept=".csv" onChange={handleFileChange} />
        <button className='user-button' onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit CSV file'}
        </button>
      </div>
    </Modal>
  );
};

export default UploadCSV;
