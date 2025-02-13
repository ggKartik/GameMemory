import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Grid from "./Components/Grid";
import UserForm from "./Components/UserForm";
import Timer from "./Components/Timer";
import AdminForm from "./Components/AdminForm"; 
import axios from "axios";
import "./App.css"; 

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    timeTaken: "0",
  });

  const [level, setLevel] = useState(1);
  const [timeTaken, setTimeTaken] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isReady, setIsReady] = useState(0);

  useEffect(() => {
    if (timeTaken != null) {
      setFormData({
        ...formData,
        timeTaken: timeTaken,
      });
      setIsReady(1);
    }
  }, [timeTaken]);

  useEffect(() => {
    if (level === 6) {
      setIsRunning(false);
      alert("Game Completed!");
    }
  }, [level]);

  useEffect(() => {
    if (isReady) {
      postData();
    }
  }, [isReady]);

  const postData = async () => {
    try {
      const response = await axios.post(`https://game-memory-opal.vercel.app/`, formData);
      if (response.data.success) {
        console.log("User data saved successfully:", response.data);
      } else {
        console.error("Failed to save user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error posting user data:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="game-container">
              {formSubmitted ? (
                <div className="vstack">
                  <div className="timer">
                    <Timer isRunning={isRunning} setIsRunning={setIsRunning} setTimeTaken={setTimeTaken} />
                  </div>
                  {level === 6 ? null : <div className="level-display">Level {level}</div>}
                  {level === 6 ? null : (
                    <Grid rows={level + 1} columns={level + 2} setLevel={setLevel} level={level} />
                  )}
                </div>
              ) : (
                <div className="form-overlay">
                  <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    setIsRunning={setIsRunning}
                    setFormSubmitted={setFormSubmitted}
                  />
                </div>
              )}
            </div>
          }
        />
        <Route path="/RMoney/Admin" element={<AdminForm />} />
      </Routes>
    </Router>
  );
};

export default App;
