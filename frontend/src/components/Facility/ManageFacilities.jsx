import React, { useEffect, useState } from "react";
import {
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../../apiService";
import FacilityCard from "./FacilityCard";
import FacilityForm from "./FacilityForm";
import FacilityModal from "./FacilityModal";
import { FaTimes } from "react-icons/fa";
import "./styles.css";
import Navbar from "../navbar";

const ManageFacilities = () => {
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
      const response = await getAllFacilities();
      console.log("facilities", response);
      
      setInitiators(response.data.data);
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
    console.log("i am here in add");

    setSelectedInitiator(null);
    openModal(<FacilityForm onSubmit={handleFormSubmit} />);
  };

  const handleEdit = (initiator) => {
    console.log("i am here in edit");
    
    setSelectedInitiator(initiator);
    openModal(
      <FacilityForm initiator={initiator} onSubmit={handleFormSubmit} />
    );
  };

  const handleDelete = async () => {
    try {
      await deleteFacility(selectedInitiator._id);
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
            <b>Label: </b> {initiator.label}
          </p>
          <p>
            <b>Capacity: </b> {initiator.capacity}
          </p>
          <p>
            <b>State: </b> {initiator.state}
          </p>
          <p>
            <b>Created at: </b> {initiator.createdAt}
          </p>
          <p>
            <b>Updated at: </b> {initiator.updatedAt}
          </p>
        </div>
      </div>
    );
    openModal(content);
  };

  const handleFormSubmit = async (data) => {
    try {
      console.log("initiat ors", initiators);
      
      if (initiators) {
        
        await updateFacility(data._id, data);
      } else {
        console.log("selectedInitiator", selectedInitiator);
        
        createFacility(data)
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
        <div className="add-user-button">
          <button className="user-button" onClick={handleAdd}>
            Add New Facility
          </button>
        </div>
        <div className="initiator-cards">
          {initiators.map((initiator) => (
            <FacilityCard
              key={initiator._id}
              initiator={initiator}
              onEdit={handleEdit}
              onDelete={() => openConfirmationModal(initiator)}
              onConsult={handleConsult}
            />
          ))}
        </div>
        <FacilityModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Initiator Modal"
        >
          {modalContent}
          <FaTimes
            className="user-close-button close-icon"
            onClick={closeModal}
          />
        </FacilityModal>
        <FacilityModal
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
        </FacilityModal>
      </div>
    </div>
  );
};

export default ManageFacilities;