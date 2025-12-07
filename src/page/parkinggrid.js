import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Slot from './user';
import backgroundImage from ".//images/19.jpg";
import './User.css';

function ParkingGrid() {
  const navigate = useNavigate();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [aadharNumbers, setAadharNumbers] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  useEffect(() => {
    try {
      axios.get(`http://localhost:3001/find?floor=${selectedFloor}`, {})
        .then((res) => {
          console.log(res.data.message);
          const fetchedBookedSlots = res.data.message;
          setBookedSlots(fetchedBookedSlots.map(({ slotId, floor }) => `${floor}-${slotId}`));
  
          // Check if all slots on the selected floor are booked
          const maxSlots = 10;
          const bookedSlotsForSelectedFloor = fetchedBookedSlots.filter(({ floor }) => floor === selectedFloor);
          if (bookedSlotsForSelectedFloor.length === maxSlots && !hasShownMessage) {
            alert(`All slots on Floor ${selectedFloor} are booked.`);
            setHasShownMessage(true); // Set hasShownMessage to true after showing the message
          } else if (bookedSlotsForSelectedFloor.length < maxSlots) {
            setHasShownMessage(false); // Reset hasShownMessage to false when slots become available
          }
        });
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  }, [selectedSlots, selectedFloor, hasShownMessage]);
  const handleSlotClick = (id) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter((slotId) => slotId !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  const handleAadharChange = (slotId, aadharNumber) => {
    setAadharNumbers({ ...aadharNumbers, [slotId]: aadharNumber });
  };

  const handleBookSlots = () => {
    if (selectedTime && selectedDate && selectedSlots.length > 0) {
      setLoading(true);

      setTimeout(() => {
        const hourlyRate = 40;
        const hoursSelected = parseInt(selectedTime);

        const bookingData = selectedSlots.map(slotId => ({
          slot: slotId.split('-')[1],
          time: selectedTime,
          date: selectedDate,
          aadharNumber: aadharNumbers[slotId],
          floor: selectedFloor
        }));

        axios.post('http://localhost:3001/book-slot', { bookings: bookingData })
          .then(response => {
            console.log(response.data.message);
            setSelectedSlots([]);
            setSelectedTime('');
            setSelectedDate('');
            setLoading(false);
            setBookedSlots([...bookedSlots, ...selectedSlots]);
            navigate('/payment', { state: { selectedSlots, selectedTime, selectedDate } });
          })
          .catch(error => {
            console.error('Error booking slots: ' + error.message);
            setLoading(false);
          });
      }, 2000);
    } else {
      console.error('Please select date, time, and slots to book');
    }
  };

  const handleUnbookSlots = () => {
    if (selectedSlots.length > 0) {
      setLoading(true);
  
      setTimeout(() => {
        axios.post('http://localhost:3001/unbook-slot', { slots: selectedSlots })
          .then(response => {
            console.log(response.data.message);
            setSelectedSlots([]);
            setLoading(false);
            setHasShownMessage(false); // Reset hasShownMessage after successful unbooking
          })
          .catch(error => {
            console.error('Error unbooking slots: ' + error.message);
            setLoading(false);
          });
      }, 2000);
    } else {
      console.error('Please select slots to unbook');
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(parseInt(e.target.value));
  };

  const hourlyRate = 40;
const hoursSelected = parseInt(selectedTime) || 0; // Use 0 as default if selectedTime is not a valid number
let totalCost1 = 0;

if (hoursSelected > 0 && selectedSlots.length > 0) {
  totalCost1 = hourlyRate * hoursSelected * selectedSlots.length;
}

console.log();

  console.log()

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {loading && (
        <div className="loading-overlay">
          <div className="loading"></div>
        </div>
      )}
      <h2>Parking Slot Booking</h2>
      <div className="floor-selection">
        <label htmlFor="floor-select">Select Floor:</label>
        <select id="floor-select" value={selectedFloor} onChange={handleFloorChange}>
          <option value={1}>Floor 1</option>
          <option value={2}>Floor 2</option>
          <option value={3}>Floor 3</option>
        </select>
      </div>

      <div className="parking-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot) => {
          const slotId = `${selectedFloor}-${slot}`;
          const isSelected = selectedSlots.includes(slotId);
          const isBooked = bookedSlots.includes(slotId);

          return (
            <div key={slotId}>
              <Slot
                id={slotId}
                selected={isSelected}
                booked={isBooked}
                onClick={handleSlotClick}
                bookingTime={isSelected ? selectedTime : ''}
              />
              {isSelected && (
                <input
                  type="text"
                  placeholder="Enter Aadhar card number"
                  value={aadharNumbers[slotId] || ''}
                  onChange={(e) => handleAadharChange(slotId, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="time-selection">
        <label>Select Date:</label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <label>Select Time:</label>
        <div className="time-slider">
          <input
            type="range"
            min="1"
            max="7"
            value={selectedTime}
            onChange={handleTimeChange}
            className="slider"
          />
          <div className="time-value">{selectedTime} hour(s)</div>
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleBookSlots} disabled={selectedSlots.length === 0 || !selectedTime || !selectedDate}>
          {loading ? 'Booking...' : 'Book Selected Slots'}
        </button>
        <button onClick={handleUnbookSlots} disabled={selectedSlots.length === 0}>
          {loading ? 'Unbooking...' : 'Unbook Selected Slots'}
        </button>
      </div>
      <div>
        <strong>Total Cost: Rs. {totalCost1}</strong>
      </div>
      <div className='home-dd'>
        <Link to="/home">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default ParkingGrid;