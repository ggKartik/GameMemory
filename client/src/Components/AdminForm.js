import React, { useState } from "react";
import axios from "axios";
import "./AdminForm.css";
import PopupMessage from "./PopupMessage";
const AdminForm = () => {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = async (e) => {
    console.log("hello bhaiya");
    
    e.preventDefault();
    try {
      // const response = await axios.post("https://game-memory-opal.vercel.app/register", { email });
      const response = await axios.post("http://localhost:3001/register", { email });
      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setPopupMessage("User registered successfully.");
      } else {
        setPopupMessage("Failed to register user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setPopupMessage(error.response.data.message);
      } else {
        setPopupMessage("An error occurred while registering the user.");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-form-card">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
      {accessToken && (
        <div className="access-token-container">
          <h3>Access Token</h3>
          <p>{accessToken}</p>
        </div>
      )}

    <PopupMessage message={popupMessage} onClose={() => setPopupMessage("")} />
    </div>
  );
};

export default AdminForm;
