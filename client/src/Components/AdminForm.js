import React, { useState } from "react";
import axios from "axios";
import "./AdminForm.css";

const AdminForm = () => {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // console.log("email ",email);
      
      const response = await axios.post("http://localhost:3001/register", { email : email});
      // console.log(response);
      
      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        alert("User registered successfully. Access Token: " + response.data.accessToken);
      } else {
        alert("Failed to register user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering the user.");
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Admin Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>

      {accessToken && (
        <div className="access-token-display">
          <h3>Access Token:</h3>
          <p>{accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default AdminForm;
