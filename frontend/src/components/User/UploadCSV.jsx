import React, { useState } from 'react';
import axios from 'axios';
import { BiBarcodeReader } from "react-icons/bi";

const UploadCSV = () => {
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
    <div className="add-user-button upload-csv">
      
      <input className='csv-input' type="file" accept=".csv" onChange={handleFileChange} />
      <button className='user-button '  onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'} 
      </button>
      <p className="or">OR</p>
    </div>
  );
};

export default UploadCSV;
