import React, { useState } from "react";
import "./Login.css";
import { auth } from "./firebase";
import { AlertError, Loader } from "./utils";
import emailvalidator from "email-validator";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import freeEmailDomains from "free-email-domains";
import passwordValidator from "password-validator";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import firebase from "firebase/compat/app";
import axios from "./axios";
import loginImg from "./login.jpeg";

const collection = db.collection("users");

export const sendVerificationEmail = async (emailVerificationId, email) => {
  await db.collection("email_verification").add({
    email: email,
    verification_id: emailVerificationId,
    is_verified: false,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  });

  const verificationLink = `${window.location.origin}/verify-account?verification_id=${emailVerificationId}&email=${email}`;
  await axios.post("/email/send-verification", {
    recipient: email,
    link: verificationLink,
  });
  return true;
};

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validPassword = (pwd) => {
    var schema = new passwordValidator();

    // TODO: uncomment later
    // schema
    //   .is()
    //   .min(8) // Minimum length 8
    //   .has()
    //   .uppercase() // Must have uppercase letters
    //   .has()
    //   .lowercase()
    //   .has()
    //   .digits(1);

    return schema.validate(pwd);
  };

  const validUserName = (input) => {
    var schema = new passwordValidator();

    schema.is().min(8).has().lowercase().has().digits(3);

    return schema.validate(input);
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name) {
      return AlertError("Please enter a full name!");
    }

    if (!userName) {
      return AlertError("Please enter a username!");
    }

    if (!validUserName(userName)) {
      return AlertError(
        "Username min length is 8 char with min 3 numeric digits!"
      );
    }

    const verificationId = uuidv4();
    try {
      const querySnapshotUser = await collection
        .where("username", "==", userName)
        .get();

      if (
        !querySnapshotUser.empty &&
        querySnapshotUser.docs &&
        querySnapshotUser.docs[0] &&
        querySnapshotUser.docs[0].data() &&
        querySnapshotUser.docs[0].data().username
      ) {
        if (querySnapshotUser.docs[0].data().username === userName) {
          return AlertError("Username already exist");
        }
      }

      console.log("querySnapshotUser");
      console.log(querySnapshotUser);
    } catch (error) {
      AlertError(error);
    }

    const isValidEmail = emailvalidator.validate(email);
    if (!isValidEmail) {
      return AlertError("Invalid email format");
    }

    const emailDomain = email.split("@")[1];
    const isValidEmailDomains = freeEmailDomains.includes(emailDomain);
    if (!isValidEmailDomains) {
      return AlertError(`Invalid email domain: ${emailDomain}`);
    }

    if (password !== passwordConfirm) {
      return AlertError("Password different with confirmation");
    }

    if (!validPassword(password)) {
      return AlertError(
        "Password should have min 8 char, uppercase and lowercase alphabets, and number"
      );
    }

    setIsLoading(true);
    try {
      await collection.add({
        email: email,
        username: userName,
        display_name: name,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      });

      const userAuth = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await userAuth.user.updateProfile({
        displayName: name,
      });

      await sendVerificationEmail(verificationId, email);
    } catch (error) {
      AlertError(error);
    }

    setIsLoading(false);
    Swal.fire("Success, verification link has been sent to your email").then(
      (res) => {
        navigate(`/login?after_register=true&email=${email}`);
      }
    );
  };

  return (
    <div className="login">
      <Loader visible={isLoading} />
      <h1>Register</h1>
      <img src={loginImg} alt="" />

      <form autoComplete="off" onSubmit={register}>
        <OutlinedInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name (required if registering)"
          type="text"
          autoComplete="off"
        />
        <br />
        <OutlinedInput
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          type="text"
          autoComplete="off"
        />
        <br />
        <OutlinedInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="off"
        />
        <br />
        <OutlinedInput
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <br />
        <OutlinedInput
          placeholder="Confirm Password"
          type={showPasswordConfirm ? "text" : "password"}
          autoComplete="off"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <br />
        <Button variant="contained" type="submit">Register</Button>
      </form>
      <p>
        <Link to="/login" className="login__register">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
