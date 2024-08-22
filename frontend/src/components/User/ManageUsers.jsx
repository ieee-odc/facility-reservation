import React, { useEffect, useState } from "react";
import {
  getAllInitiators,
  createInitiator,
  updateInitiator,
  deleteInitiator,
} from "../../apiService";
import InitiatorCard from "./InitiatorCard";
import InitiatorForm from "./InitiatorForm";
import InitiatorModal from "./InitiatorModal";
import UploadCSV from "./UploadCSV";
import { FaTimes } from "react-icons/fa";
import "./styles.css";
import Navbar from "../navbar";

const ManageUsers = () => {
  const [initiators, setInitiators] = useState([]);
  const [selectedInitiator, setSelectedInitiator] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchInitiators();
  }, []);

  const fetchInitiators = async () => {
    try {
      const response = await getAllInitiators();
      setInitiators(response.data);
    } catch (error) {
      console.error("Error fetching initiators:", error);
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalIsOpen(false);
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

  const handleEdit = (initiator) => {
    setSelectedInitiator(initiator);
    openModal(
      <InitiatorForm initiator={initiator} onSubmit={handleFormSubmit} />
    );
  };

  const handleDelete = async () => {
    try {
      await deleteInitiator(selectedInitiator._id);
      fetchInitiators();
      closeConfirmationModal();
    } catch (error) {
      console.error("Error deleting initiator:", error);
    }
  };

  const handleConsult = (initiator) => {
    const content = (
      <div>
        <h3>{initiator.name}</h3>
        <div className="manage-user-consult">
          <p>
            <b>Email: </b> {initiator.email}
          </p>
          <p>
            <b>Phone: </b> {initiator.phoneNumber}
          </p>
          <p>
            <b>Backup Email: </b> {initiator.backupEmail}
          </p>
          <p>
            <b>Nature: </b> {initiator.nature}
          </p>
          <p>
            <b>Service: </b> {initiator.service}
          </p>
          <p>
            <b>Organization: </b> {initiator.organisation}
          </p>
        </div>
      </div>
    );
    openModal(content);
  };

  const handleFormSubmit = async (data) => {
  console.log("data", data);
  console.log("selectedInitiator", selectedInitiator);

    try {
      if (data && data._id) {
        await updateInitiator(data._id, data);
      } else {
        createInitiator(data)
          .then((resp) => {
            console.log("done --------", resp);
          })
          .catch((error) => {
            console.log("here", error);
          });
      }
      fetchInitiators();
      closeModal();
    } catch (error) {
      console.error("Error saving initiator:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="manage-users-container">
      <UploadCSV />
        <div className="add-user-button">
          <button className="user-button" onClick={handleAdd}>
            Add New Initiator
          </button>
        </div>
        <div className="initiator-cards">
          {initiators.map((initiator) => (
            <InitiatorCard
              key={initiator._id}
              initiator={initiator}
              onEdit={handleEdit}
              onDelete={() => openConfirmationModal(initiator)}
              onConsult={handleConsult}
            />
          ))}
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
        <InitiatorModal
          isOpen={confirmationModalOpen}
          onRequestClose={closeConfirmationModal}
          contentLabel="Delete Confirmation"
        >
          <div>
            <p>Are you sure you want to delete {selectedInitiator?.name}?</p>
            <button
              className="user-button user-delete-button"
              onClick={handleDelete}
            >
              Yes, Delete
            </button>
            <button
              className="user-button user-cancel-delete-button"
              onClick={closeConfirmationModal}
            >
              Cancel
            </button>
          </div>
        </InitiatorModal>
      </div>
    </div>
  );
};

export default ManageUsers;
