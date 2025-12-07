var mysql = require('mysql');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "souravnair123@",
    database: "slotbooking"
});

con.connect(function (err) {
    if (err) {
        console.log("HERE");
        throw err;
    };
    console.log("connected");
});

app.listen(3001, () => {
    console.log("Started at 3001");
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body.user;

    // Check if any required field is missing
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Proceed with registration if all fields are provided
    const query = "INSERT INTO DETAILS(NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)";
    con.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error inserting data' });
        }
        console.log("Data inserted successfully!");
        res.status(200).json({ message: "INSERTED" });
    });
});

app.post('/admin', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Query the database for the user
    const query = 'SELECT * FROM DETAILS WHERE EMAIL = ? AND PASSWORD = ?';
    con.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            // Authentication successful
            res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
            // Authentication failed
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.post('/book-slot', (req, res) => {
  const { bookings, totalCost } = req.body;
  // Receive bookings array with Aadhar numbers and floor for each slot
  // Calculate the total cost
  const hourlyRate = 40; // Cost per hour
  let totalBookingCost = 0;

  // Iterate through the array of bookings
  bookings.forEach(booking => {
    const { slot, time, date, aadharNumber, floor } = booking;

    // Parse the time value as a number, use 0 as a default value if it's not a valid number
    const parsedTime = parseInt(time) || 0;

    // Calculate the booking cost for this slot
    const bookingCost = parsedTime * hourlyRate;

    // Increment the total booking cost
    totalBookingCost += bookingCost;

    // Insert booking details into the database
    const sql = 'INSERT INTO booked_slots (slot_id, booking_time, booking_date, total_cost, aadhar, floor) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(sql, [slot, parsedTime, date, bookingCost, aadharNumber, floor], (error, results) => {
      if (error) {
        console.error('Error booking slot: ' + error.message);
        res.status(500).json({ message: 'Error booking slot' });
      } else {
        console.log(`Slot ${slot} on Floor ${floor} booked successfully for ${parsedTime} hour(s) on ${date} with a total cost of Rs. ${bookingCost}`);
      }
    });
  });

  // Send a success response back to the client
  res.status(200).json({ message: 'Slots booked successfully', totalCost: totalBookingCost });
});

app.get('/find', (req, res) => {
  const selectedFloor = req.query.floor; // Get the floor from the query parameter
  const query = "SELECT slot_id, floor FROM booked_slots WHERE floor = ?";
  con.query(query, [selectedFloor], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
    } else {
      console.log(results);
      const bookedSlots = results.map(row => ({ slotId: row.slot_id, floor: row.floor }));
      res.send({ message: bookedSlots });
    }
  });
});
app.post('/unbook-slot', (req, res) => {
    const { slots } = req.body;
  
    // Assuming 'slots' is an array of combined 'floor-slot' values
    // Split the combined values and delete records from the 'booked_slots' table
    const unbookPromises = slots.map(floorSlot => {
      const [floor, slot] = floorSlot.split('-');
      const sql = 'DELETE FROM booked_slots WHERE slot_id = ? AND floor = ?';
      return new Promise((resolve, reject) => {
        con.query(sql, [slot, floor], (error, results) => {
          if (error) {
            console.error('Error unbooking slot: ' + error.message);
            reject(error);
          } else {
            console.log(`Slot ${slot} on Floor ${floor} unbooked successfully`);
            resolve();
          }
        });
      });
    });
  
    Promise.all(unbookPromises)
      .then(() => {
        res.status(200).json({ message: 'Slots unbooked successfully' });
      })
      .catch(error => {
        console.error('Error unbooking slots: ' + error.message);
        res.status(500).json({ message: 'Error unbooking slots' });
      });
  });



  
app.post('/generate-receipt', (req, res) => {
    const { slotId, bookingTime, totalCost, selectedDate } = req.body;
  
    // Validate if all required data is provided
    if (!slotId || !bookingTime || !totalCost || !selectedDate) {
      return res.status(400).json({
        message: 'Slot ID, booking time, total cost, and selected date are required.',
      });
    }
  
    // Parse the selected date string to a Date object
    const parsedDate = new Date(selectedDate);
  
    // Check if the selected date is a valid date
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format provided.',
      });
    }
  
    // Generate receipt
    const receipt = {
      slotId,
      bookingTime,
      totalCost,
      selectedDate: parsedDate.toISOString(), // Store the selected date in ISO format
      generatedAt: new Date().toISOString(), // Adding the current date and time when the receipt was generated
    };
  
    // You can save the receipt to a database or generate a PDF and send it back to the client
    // Send the receipt back to the client
    res.status(200).json({ message: 'Receipt generated successfully', receipt });
  });
  app.get('/find', (req, res) => {
    const sql = 'SELECT * FROM booked_slots ORDER BY id DESC LIMIT 1'; // Assuming the latest booking is what we want
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching booked slot details:', err);
            res.status(500).json({ message: 'Error fetching booked slot details' });
        } else {
            if (result.length > 0) {
                const { slot_id, booking_time, total_cost } = result[0];
                res.status(200).json({ slotId: slot_id, bookingTime: booking_time, totalCost: total_cost });
            } else {
                res.status(404).json({ message: 'No booked slots found' });
            }
        }
    });
});

app.get('/revenue-data', (req, res) => {
    const date = req.query.date || ''; // Get the date from the query parameter
    const sql = `
      SELECT MAX(DATE_FORMAT(booking_date, '%Y-%m-%d')) AS date, SUM(total_cost) AS revenue
      FROM booked_slots
      WHERE DATE(booking_date) = ?
      GROUP BY DATE(booking_date)
    `;
  
    con.query(sql, [date], (err, result) => {
      if (err) {
        console.error('Error fetching revenue data:', err);
        res.status(500).json({ message: 'Error fetching revenue data' });
      } else {
        res.status(200).json(result[0] || { date, revenue: 0 });
      }
    });
  });
  
  app.get('/total-revenue', (req, res) => {
    const sql = 'SELECT SUM(total_cost) AS totalRevenue FROM booked_slots';
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching total revenue:', err);
        res.status(500).json({ message: 'Error fetching total revenue' });
      } else {
        const totalRevenue = result[0].totalRevenue || 0;
        res.status(200).json({ totalRevenue });
      }
    });
  });

