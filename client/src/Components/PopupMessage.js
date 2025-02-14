import React from "react";
import "./PopupMessage.css";

const PopupMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupMessage;
