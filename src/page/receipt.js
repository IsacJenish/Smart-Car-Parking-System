// Receipt.js
import React from 'react';
import './receipt.css';

const Receipt = ({ slotId, bookingTime, totalCost, selectedDate }) => {
  const hourlyRate = 40; // Assuming the hourly rate is 40

  return (
    <div className="receipt-container">
      <h2>Booking Receipt</h2>
      <div className="receipt-info">
        <p>Slot ID: {slotId}</p>
        <p>Booking Date: {selectedDate}</p>
        <p>Booking Time: {bookingTime} hour(s)</p>
        <p>Hourly Rate: Rs. {hourlyRate}</p>
        <p>Total Cost: Rs. {totalCost}</p>
      </div>
    </div>
  );
};

export default Receipt;