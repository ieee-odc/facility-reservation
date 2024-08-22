import React, { useState } from 'react';
import './CustomUploader.css'; // Custom styles for the uploader

const CustomUploader = ({ onFileSelect, onFileRemove }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileRemove(); // Notify parent component
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
