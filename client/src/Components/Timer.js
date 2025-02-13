import React, { useState, useEffect } from "react";
import './Timer.css';  // Import your CSS file

const Timer = ({ isRunning, setIsRunning, setTimeTaken }) => {
  const [time, setTime] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setMilliseconds((prevMillis) => {
          if (prevMillis === 99) {
            setTime((prevTime) => prevTime + 1); // Increment time every second
            return 0; // Reset milliseconds to 0 after reaching 99
          }
          return prevMillis + 1; // Increment milliseconds
        });
      }, 10);
      setIntervalId(id);
    } else {
      if (time !== 0) {
        const hours = String(Math.floor(time / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        const ms = String(milliseconds).padStart(2, "0");
        setTimeTaken(`${hours}:${minutes}:${seconds}:${ms}`);
      }
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Cleanup
  }, [isRunning]);

  const formatTime = (time, milliseconds) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    const ms = String(milliseconds).padStart(2, "0"); // Ensure milliseconds have two digits
    return `${hours}:${minutes}:${seconds}:${ms}`;
  };

  return (
    <div className="timer-container">
      <h2 className="timer-display">{formatTime(time, milliseconds)}</h2>
    </div>
  );
};

export default Timer;
