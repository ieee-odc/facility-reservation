import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

const EditableField = ({
  iconSrc,
  placeholder,
  name,
  value,
  editingField,
  handleEdit,
  handleFieldChange,
  handleCancel,
  handleApprove,
}) => (
  <div className="about-content-element">
    <img src={iconSrc} alt={name} className="icon about-content-element-one" />
    {editingField === name ? (
      <div className="edited-input about-content-element-two">
        <input
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleFieldChange}
          className="input"
        />
        <div className="interaction-buttons">
          <div className="buttons">
            <button onClick={handleApprove}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={handleCancel}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <p className="about-content-element-two" onClick={() => handleEdit(name)}>
        {value || placeholder}
      </p>
    )}
  </div>
);

export default EditableField;
