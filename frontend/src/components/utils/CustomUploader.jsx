import React, { useState } from 'react';
import './CustomUploader.css'; 

const CustomUploader = ({ onFileSelect, onFileRemove }) => {
  
  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileRemove(); 
  };

  return (
    <div className="custom-uploader">
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="upload-button">
        <span className="camera-icon">📷</span> Upload Picture
      </label>
      
      {selectedFile && (
        <div className="file-preview-container">
          <img
            src={selectedFile}
            alt="Selected Preview"
            className="file-preview"
          />
          <button className="remove-button" onClick={handleRemoveFile}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomUploader;
