import React, { useState } from "react";
import axios from "axios";
import "./AdminForm.css";

const AdminForm = () => {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async (e) => {
    console.log("hello bhaiya");
    
    e.preventDefault();
    try {
      const response = await axios.post("https://game-memory-opal.vercel.app/register", { email });
      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        alert("User registered successfully.");
      } else {
        alert("Failed to register user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering the user.");
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
    </div>
  );
};

export default AdminForm;
