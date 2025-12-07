import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './revenue.css';
import backgroundImage from ".//images/18.jpg"

function RevenuePage() {
  const [revenueData, setRevenueData] = useState({ date: '', revenue: 0 });
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchRevenueData(selectedDate);
  }, [selectedDate]);

  const fetchRevenueData = (date) => {
    axios
      .get(`http://localhost:3001/revenue-data?date=${date}`)
      .then((response) => {
        setRevenueData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching revenue data:', error.message);
      });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="revenue-container">
        <h2 className="revenue-heading">Revenue by Date</h2>
        <div className="date-input">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="revenue-card">
          <div className="revenue-date">
            <strong>Date: {revenueData.date}</strong>
          </div>
          <div className="revenue-total">
            <strong>Revenue Generated: Rs. {revenueData.revenue}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenuePage;