import React, { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        phoneNumber,
        otp,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify OTP</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default VerifyOTP;