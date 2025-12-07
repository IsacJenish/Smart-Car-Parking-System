import React, { useState } from "react";
import styles from "./register.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./13.jpg"; // Import background image
import formBackgroundImage from "./10.jpg"; // Import form background image

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !user.reEnterPassword) {
      setError("All fields are required.");
      return;
    }

    try {
      console.log(user);
      await axios.post("http://localhost:3001/register", { user }).then((res) => {
        console.log(res);
        navigate("/login"); // Navigate to login page after successful registration
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={styles["register-container"]}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={styles["register-form"]}
        style={{ backgroundImage: `url(${formBackgroundImage})` }}
      >
        <h1 className={styles["register-heading"]}>Register</h1>
        <div className={styles["form-group"]}>
          <input
            type="text"
            name="name"
            value={user.name}
            placeholder="Your Name"
            onChange={handleChange}
            className={styles["form-input"]}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            name="email"
            value={user.email}
            placeholder="Your Email"
            onChange={handleChange}
            className={styles["form-input"]}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Your Password"
            onChange={handleChange}
            className={styles["form-input"]}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="password"
            name="reEnterPassword"
            value={user.reEnterPassword}
            placeholder="Re-enter password"
            onChange={handleChange}
            className={styles["form-input"]}
          />
        </div>
        {error && <div className={styles["error-message"]}>{error}</div>}
        <div className={styles["button-group"]}>
          <button onClick={submit} className={styles["register-button"]}>
            Register
          </button>
          <div className={styles["divider"]}>or</div>
          <button
            className={styles["login-button"]}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;