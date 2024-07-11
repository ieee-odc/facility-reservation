import React, { useState } from "react";
import trash from "./../assets/icons/trash.png";
import plus from "./../assets/icons/plus.png";
import pen from "./../assets/icons/pen.png";
import manager1 from "./../assets/manager/manager1.png";
import manager2 from "./../assets/manager/manager2.png";
import Modal from "./Modal";
const Vav = () => {
  const [representatives, setRepresentatives] = useState([
    {
      id: 1,
      firstName: "FirstName1",
      lastName: "LastName1",
      position: "Position1",
      email: "firstname.lastname@gmail.com",
      phone: "Phone Number",
      picture: manager1,
    },
    {
      id: 2,
      firstName: "FirstName2",
      lastName: "LastName2",
      position: "Position2",
      email: "firstname.lastname@gmail.com",
      phone: "Phone Number",
      picture: manager2,
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRep, setCurrentRep] = useState(null);

  const handleAdd = () => {
    setCurrentRep(null);
    setModalOpen(true);
  };

  const handleEdit = (rep) => {
    setCurrentRep(rep);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setRepresentatives((reps) => reps.filter((rep) => rep.id !== id));
  };

  const handleSave = (rep) => {
    if (currentRep) {
      setRepresentatives((reps) =>
        reps.map((r) => (r.id === rep.id ? rep : r))
      );
    } else {
      setRepresentatives((reps) => [...reps, { ...rep, id: reps.length + 1 }]);
    }
    setModalOpen(false);
  };
  return (
    <div className="vis-a-vis">
    <h3>Our Representatives</h3>
    <div className="vav-content">
      <img src={plus} alt="Add" className="add-person-icon" onClick={handleAdd} />
      {representatives.map(rep => (
        <div key={rep.id} className="vav-person">
          <img src={rep.picture} alt={rep.firstName} className="person-picture" />
          <div className="basic-info">
            <p className="info-names">{rep.firstName} {rep.lastName}</p>
            <p className="info-position">{rep.position}</p>
          </div>
          <div className="more-info">
            <p className="info-email">{rep.email}</p>
            <p className="info-phone">{rep.phone}</p>
          </div>
          <div className="person-interaction">
            <img src={pen} alt="Edit" className="edit-person-icon" onClick={() => handleEdit(rep)} />
            <img src={trash} alt="Delete" className="delete-person-icon" onClick={() => handleDelete(rep.id)} />
          </div>
        </div>
      ))}
    </div>
    {modalOpen && <Modal rep={currentRep} onSave={handleSave} onClose={() => setModalOpen(false)} />}
  </div>
  );
};

export default Vav;
