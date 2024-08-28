import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./styles.css";
import { Divider } from "rsuite";

import InitiatorCard from "./InitiatorCard";
import InitiatorForm from "./InitiatorForm";
import InitiatorModal from "./InitiatorModal";

import {
  getAllInitiators,
  createInitiator,
  updateInitiator,
  deleteInitiator,
} from "../../apiService";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const UploadCSV = ({ isOpen, onRequestClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [initiators, setInitiators] = useState([]);
  const [selectedInitiator, setSelectedInitiator] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const navigate = useNavigate();

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalIsOpen(false);
  };

  const fetchInitiators = async () => {
    try {
      const response = await getAllInitiators();
      setInitiators(response.data);
    } catch (error) {
      console.error("Error fetching initiators:", error);
    }
  };

  const openConfirmationModal = (initiator) => {
    setSelectedInitiator(initiator);
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setSelectedInitiator(null);
    setConfirmationModalOpen(false);
  };

  const handleAdd = () => {
    setSelectedInitiator(null);
    openModal(<InitiatorForm onSubmit={handleFormSubmit} />);
  };

  const handleFormSubmit = async (data) => {
    console.log("data", data);
    console.log("selectedInitiator", selectedInitiator);

    try {
      if (data && data._id) {
        await updateInitiator(data._id, data);
        navigate('/manage-users')
        window.location.reload();

      } else {
        createInitiator(data)
          .then((resp) => {
            console.log("done --------", resp);
            navigate('/manage-users')
            window.location.reload();

          })
          .catch((error) => {
            console.log("here", error);
          });
      }
      //fetchInitiators();
      //closeModal();
    } catch (error) {
      console.error("Error saving initiator:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reservationInitiators/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      console.log(response);
      navigate('/manage-users')
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
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
      <button onClick={onRequestClose} className="modal-close-button">
        x
      </button>
      <div className="upload-csv-content">
        <h3 className="modal-title">Add New Initiator</h3>
        <br />
        <div className="add-user-button">
          <button className="user-button" onClick={handleAdd}>
            Add Manually
          </button>
        </div>
        <Divider>OR</Divider>
        <input
          className="csv-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          className="user-button"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {file ? "CSV file selected" : "Submit CSV file"}
        </button>
        <br />
        <br />
        <a
          href="/src/assets/Feuille de calcul sans titre.xlsx"
          download="CSV_Template.xlsx"
          className="download-link"
        >
          Download CSV template here
        </a>
      </div>
      <InitiatorModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Initiator Modal"
      >
        {modalContent}
        <FaTimes
          className="user-close-button close-icon"
          onClick={closeModal}
        />
      </InitiatorModal>
    </Modal>
  );
};

export default UploadCSV;
