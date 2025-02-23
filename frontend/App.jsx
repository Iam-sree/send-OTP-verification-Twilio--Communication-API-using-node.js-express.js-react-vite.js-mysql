import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import VerifyOTP from "./components/VerifyOTP";
import Login from "./components/Login";

const App = () => {
  return (
    <div>
      <h1>Registration Form</h1>
      <RegistrationForm />
      <h1>Verify OTP</h1>
      <VerifyOTP />
      <h1>Login</h1>
      <Login />
    </div>
  );
};

export default App;