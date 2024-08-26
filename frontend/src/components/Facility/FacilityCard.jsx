import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { FiInfo } from "react-icons/fi";

const FacilityCard = ({ initiator, onEdit, onDelete, onConsult }) => {
  return (
    <div className="initiator-card">
      <h2>{initiator.label}</h2>
    
      <p>
        <b> Capacity:</b> {initiator.capacity}
      </p>
      <p>
        <b> State:</b> {initiator.state}
      </p>
      <div className="actions">
        <FaRegEdit onClick={() => onEdit(initiator)} className="icon" />
        <GoTrash onClick={() => onDelete(initiator)} className="icon" />
        <FiInfo  onClick={() => onConsult(initiator)} className="icon info-icon" />
      </div>
    </div>
  );
};

export default FacilityCard;
