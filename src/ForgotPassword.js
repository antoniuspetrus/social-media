import React, { useState } from "react";
import "./Login.css";
import { AlertError, Loader } from "./utils";
import emailvalidator from "email-validator";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "./firebase";
import axios from "./axios";
import { v4 as uuidv4 } from "uuid";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@mui/material";

function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenId = uuidv4();

    const isValidEmail = emailvalidator.validate(email);
    if (!isValidEmail) {
      return AlertError("Invalid email format");
    }

    setIsLoading(true);

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        AlertError(error);
      });

    // await db.collection("forgot_password_links").add({
    //   email: email,
    //   token: tokenId,
    //   is_used: false,
    // });

    // // axios
    // const resetPwdLink = `${window.location.origin}/reset-password?token=${tokenId}&email=${email}`;
    // await axios.post("/email/forgot-password", {
    //   recipient: email,
    //   link: resetPwdLink,
    // });

    setIsLoading(false);
    Swal.fire(
      "Success, password reset email link has been sent to your email"
    ).then((res) => {
      navigate("/login");
    });
  };

  return (
    <div className="login">
      <Loader visible={isLoading} />
      <h1>Forgot Password</h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="off"
        />
        <Button variant="contained" type="submit">Forgot Password</Button>
      </form>
      <p>
        <Link to="/login" className="login__register">
          Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
