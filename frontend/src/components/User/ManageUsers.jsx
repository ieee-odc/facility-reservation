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
import { TagPicker } from "rsuite";

import "./styles.css";
import Navbar from "../navbar";

const ManageUsers = () => {
  const [initiators, setInitiators] = useState([]);
  const [selectedInitiator, setSelectedInitiator] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [uploadCSVModalOpen, setUploadCSVModalOpen] = useState(false); 
  const [modalContent, setModalContent] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]); 

  const [filter, setFilter] = useState({
    role: []
  })

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

  const openUploadCSVModal = () => {
    setUploadCSVModalOpen(true);
  };

  const closeUploadCSVModal = () => {
    setUploadCSVModalOpen(false);
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
          <p>
            <b>Role: </b> {initiator.role}
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

  const filteredInitiators = initiators.filter((initiator) => (filter.role.length === 0 || filter.role.includes(initiator.role)) )
   

  return (
    <div>
      <Navbar />
      <div className="manage-users-container">
      
        <div className="add-user-button">
          <button  onClick={openUploadCSVModal}>
            + Add New Initiator
          </button>
        </div>

        <div className="filters">
          <TagPicker
            data={["Admin", "SuperAdmin", "User"].map(
              (role) => ({ label: role, value: role })
            )}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, role: value }))
            }
            placeholder="Filter by Role"
            
          />
        </div>
            
        <div className="initiator-cards">
          {filteredInitiators.map((initiator) => (
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
        <UploadCSV
          isOpen={uploadCSVModalOpen}
          onRequestClose={closeUploadCSVModal}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
