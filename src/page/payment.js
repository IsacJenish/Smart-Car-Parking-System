import React, { useState, useEffect } from 'react';
import Receipt from './receipt';
import { useLocation, Link } from 'react-router-dom';
import './payment.css';
import backgroundImage from ".//images/17.jpg";

function PaymentPage() {
  const location = useLocation();
  const [paymentOption, setPaymentOption] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (location.state && location.state.selectedSlots && location.state.selectedTime && location.state.selectedDate) {
      const { selectedSlots, selectedTime, selectedDate } = location.state;
      setBookingTime(selectedTime);
      setSelectedSlotId(selectedSlots[0]);
      setSelectedDate(selectedDate);
      console.log("Selected Slots:", selectedSlots);
      console.log("Selected Time:", selectedTime);
      console.log("Selected Date:", selectedDate);
    }
  }, [location.state]);

  const handleQRScannerPayment = () => {
    setPaymentOption('qrScanner');
  };

  const handleCashPayment = () => {
    setPaymentOption('cash');
    const hourlyRate = 40;
    const hoursSelected = parseInt(bookingTime);
    const cost = hourlyRate * hoursSelected;
    setTotalCost(cost);
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
      <div className="payment-container">
        <h2>Payment Options</h2>
        <div className="payment-buttons">
          <button onClick={handleQRScannerPayment} className="payment-button">
            QR Scanner
          </button>
          <button onClick={handleCashPayment} className="payment-button">
            Cash
          </button>
          <Link to="/parkinggrid">
            <button className="payment-button">Book Another Slot</button>
          </Link>
        </div>
        {paymentOption === 'qrScanner' ? (
          <div className="qr-image">
            <img src="./1.jpeg" alt="QR Code" />
          </div>
        ) : paymentOption === 'cash' ? (
          <div className="cash-payment">
            <Receipt
              slotId={selectedSlotId}
              bookingTime={bookingTime}
              totalCost={totalCost}
              selectedDate={selectedDate}
            />
            <button onClick={() => window.print()} className="print-button">
              Print Receipt
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PaymentPage;