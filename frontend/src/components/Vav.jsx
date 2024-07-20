import React, { useEffect, useState } from "react";
import edit from "./../assets/edit.png";
import manager1 from "./../assets/manager/manager1.png";
import manager2 from "./../assets/manager/manager2.png";
import Modal from "./Modal";
import DeleteModal from "./DeleteModal";
import "./Modal.css";

import axios from "axios";
import deleteIcon from "./../assets/delete.png";

const Vav = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRep, setSelectedRep] = useState(null);
  const [representatives, setRepresentatives] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      position: "Manager",
      email: "john.doe@gmail.com",
      phone: "1234567890",
      picture: manager1,
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      position: "Assistant Manager",
      email: "jane.smith@gmail.com",
      phone: "0987654321",
      picture: manager2,
    },
  ]);

  //const [representatives, setRepresentatives] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/responsibles")
      .then((response) => {
        console.log("reponse", response.data);
        //setemployees(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteClick = (rep) => {
    setSelectedRep(rep);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setRepresentatives(
      representatives.filter((rep) => rep.id !== selectedRep.id)
    );
    setShowDeleteModal(false);
  };

  return (
    <div className="vis-a-vis">
      <h3>Our Representatives</h3>
      <div className="add-button">
        <button onClick={() => setShowModal(true)}>Add a representative</button>
      </div>
      <div className="vav-content">
        {representatives.map((rep) => (
          <div className="vav-person main-profile-card" key={rep.id}>
            <img
              src={rep.picture}
              alt={rep.firstName}
              className="person-picture"
            />
            <div className="basic-info">
              <p className="info-names">
                {rep.firstName} {rep.lastName}
              </p>
              <p className="info-position">{rep.position}</p>
            </div>
            <div className="more-info">
              <p className="info-email">{rep.email}</p>
              <p className="info-phone">{rep.phone}</p>
            </div>
            <div className="person-interaction">
              <img
                src={edit}
                alt="Edit"
                className="edit-person-icon"
                onClick={() => {
                  setSelectedRep(rep);
                  setShowModal(true);
                }}
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className="delete-person-icon"
                onClick={() => handleDeleteClick(rep)}
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          rep={selectedRep}
          onSave={(data) => {
            console.log("Saved:", data);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Vav;
