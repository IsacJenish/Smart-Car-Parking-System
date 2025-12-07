import React from 'react';
import './User.css';

function Slot({ id, selected, booked, onClick, bookingTime }) {
  let slotColor = 'green';
  if (selected) {
    slotColor = 'yellow';
  }
  if (booked) {
    slotColor = 'red';
  }
  const slotStyle = {
    backgroundColor: slotColor,
    width: '120px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const [floor, slot] = id.split('-');

  return (
    <div className="slot-container">
      <div className={id} style={slotStyle} onClick={() => onClick(id)}>
        {booked ? `Booked ` : `Slot ${slot} (Floor ${floor})`}
      </div>
    </div>
  );
}

export default Slot;

