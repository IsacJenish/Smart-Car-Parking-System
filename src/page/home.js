import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import logo from ".//images/14.jpg"; // Import your logo image

function OnlineParkingSystem() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <>
      <nav className={styles.navbar}>
        <div>
          <img src={logo} alt="Logo" className={styles.logo} /> {/* Render the logo image */}
        </div>
        <ul className={styles.navLinks}>
          <li><Link to="/home">Home</Link></li>
          {isAuthenticated && (
            <li><Link to="/parkinggrid">Slot</Link></li>
          )}
          <li><Link to="/login">Admin</Link></li>
          <li>
            {isAuthenticated ? (
              <button className={styles.button} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
              </button>
            ) : (
              <button className={styles.button} onClick={() => loginWithRedirect()}>
                Log In
              </button>
            )}
          </li>
        </ul>
      </nav>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Welcome to the Online Parking Booking System</h1>
          <p>Book your parking slots with ease and convenience.</p>
          
        </div>
      </header>
    </>
  );
}

export default OnlineParkingSystem;