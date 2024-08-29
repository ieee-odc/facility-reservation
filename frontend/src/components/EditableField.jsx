import React, { useState } from "react";
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
  tooltipText = "You can edit this property here",
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  return (
    <>
      <div
        className="about-content-element"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <img
          src={iconSrc}
          alt={name}
          className="icon about-content-element-one"
        />
        {editingField === name ? (
          <div className="edited-input about-content-element-two">
            <input
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={handleFieldChange}
              className="input"
              readOnly={name === "email" && true || false}
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

          name === "email"&& (<p
            className="about-content-element-two about-content-element-two-email"
          >
            {value || placeholder}
          </p>) ||
          (<p
            className="about-content-element-two"
            onClick={() => handleEdit(name)}
          >
            {value || placeholder}
          </p>)
        )}
        {(isTooltipVisible && editingField!==name && name !=="email") && <div className="tooltip">{tooltipText}</div>}
      </div>
    </>
  );
};

export default EditableField;
