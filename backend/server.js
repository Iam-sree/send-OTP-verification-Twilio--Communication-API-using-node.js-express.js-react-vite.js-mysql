const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Twilio credentials (replace with your own)
const accountSid = "your_detal";
const authToken = "your_detals";
const client = twilio(accountSid, authToken);

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "user_registration",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register user
app.post("/register", (req, res) => {
  const { name, age, phoneNumber, imageUrl } = req.body;
  const otp = generateOTP();

  const sql = `INSERT INTO users (name, age, phone_number, image_url, otp) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, age, phoneNumber, imageUrl, otp], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    // Send OTP via Twilio
    client.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: "your_number", // Your Twilio number
        to: phoneNumber,
      })
      .then(() => {
        res.status(200).json({ message: "OTP sent successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to send OTP" });
      });
  });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  const sql = `SELECT * FROM users WHERE phone_number = ? AND otp = ?`;
  db.query(sql, [phoneNumber, otp], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      res.status(200).json({ message: "OTP verified", user: result[0] });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  });
});

// Login user
app.post("/login", (req, res) => {
  const { phoneNumber } = req.body;

  const sql = `SELECT * FROM users WHERE phone_number = ?`;
  db.query(sql, [phoneNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      res.status(200).json({ message: "Login successful", user: result[0] });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});