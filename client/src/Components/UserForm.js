import "./UserForm.css";

const UserForm = ({ formData, setFormData, setIsRunning, setFormSubmitted }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the email and token to the backend for authentication
    try {
      const response = await fetch("http://localhost:3001/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          accessToken: formData.accessToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Authentication successful! Starting the game...");
        setIsRunning(1);
        setFormSubmitted(true);
      } else {
        alert("Authentication failed! Please check your email and access token.");
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      alert("An error occurred while authenticating.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-instructions">
        <h2>Welcome to the Memory Game!</h2>
        <p>
          Memory game, as the name implies, is a game where you have to locate the pair of each card.
          You have to memorize their locations and uncover them until there are no more left.
        </p>
        <p>On submitting the form, the timer will start. Your goal is to clear all levels as quickly as possible. Good luck!</p>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="accessToken">Access Token:</label>
          <input
            type="text"
            id="accessToken"
            name="accessToken"
            value={formData.accessToken}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="start-btn">Start</button>
      </form>
    </div>
  );
};

export default UserForm;
