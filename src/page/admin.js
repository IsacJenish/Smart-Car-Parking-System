import React, { useState } from "react";
import styles from "./admin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from ".//images/13.jpg"; // Import background image
import formBackgroundImage from ".//images/10.jpg"; // Import form background image

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      console.log(user);
      const response = await axios.post("http://localhost:3001/admin", user);
      console.log(response.data);
      if (response.data.message === "Login successful") {
        alert("Login successful!");
        navigate("/revenue");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div
      className={styles["login-container"]}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={styles["login-form"]}
        style={{ backgroundImage: `url(${formBackgroundImage})` }}
      >
        <h1 className={styles["login-heading"]}>Login</h1>
        <div className={styles["form-group"]}>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter your Email"
            className={styles["form-input"]}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            className={styles["form-input"]}
          />
        </div>
        {error && <div className={styles["error-message"]}>{error}</div>}
        <div className={styles["button-group"]}>
          <button onClick={submit} className={styles["login-button"]}>
            Login
          </button>
          <div className={styles["divider"]}>or</div>
          <button
            onClick={() => navigate("/register")}
            className={styles["register-button"]}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;