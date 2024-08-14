import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { FiInfo } from "react-icons/fi";

const InitiatorCard = ({ initiator, onEdit, onDelete, onConsult }) => {
  return (
    <div className="initiator-card">
      <h2>{initiator.name}</h2>
      <p>
        {" "}
        <b> Email:</b> {initiator.email}
      </p>
      <p>
        <b> Phone number:</b> {initiator.phoneNumber}
      </p>
      <div className="actions">
        <FaRegEdit onClick={() => onEdit(initiator)} className="icon" />
        <GoTrash onClick={() => onDelete(initiator)} className="icon" />
        <FiInfo  onClick={() => onConsult(initiator)} className="icon info-icon" />
      </div>
    </div>
  );
};

export default InitiatorCard;
