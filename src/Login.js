import React, { useState, useEffect } from "react";
import "./Login.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { login } from "./features/userSlice";
import { AlertError, Loader } from "./utils";
import { Link, useLocation } from "react-router-dom";
import qs from "query-string";
import Swal from "sweetalert2";
import { db } from "./firebase";
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import emailvalidator from "email-validator";
import loginImg from "./login.jpeg";
import { sendVerificationEmail } from "./Register";
import { v4 as uuidv4 } from "uuid";

function Login() {
  const [emailOrUserName, setEmailOrUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const parsed = qs.parse(useLocation().search);
  useEffect(() => {
    if (parsed) {
      if (parsed.verified === "true") {
        Swal.fire("Success, your email has been verified!");
      }
      if (parsed.reset_success === "true") {
        Swal.fire("Success, your password has been changed!");
      }
    }
  }, []);

  const onBeforeLogin = async () => {
    let email = "";
    const isEmail = emailvalidator.validate(emailOrUserName);
    if (isEmail) {
      email = emailOrUserName;
    } else {
      const querySnapshotUser = await db
        .collection("users")
        .where("username", "==", emailOrUserName)
        .get();
      if (
        !querySnapshotUser.empty &&
        querySnapshotUser.docs &&
        querySnapshotUser.docs[0] &&
        querySnapshotUser.docs[0].data() &&
        querySnapshotUser.docs[0].data().email
      ) {
        email = querySnapshotUser.docs[0].data().email;
      }
    }
    return email;
  };

  const loginToApp = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const email = await onBeforeLogin();

    console.log("logintoapp");

    try {
      const querySnapshot = await db
        .collection("email_verification")
        .where("email", "==", email)
        .orderBy("created_at", "desc")
        .get();

      if (!querySnapshot.empty) {
        if (!querySnapshot.docs[0].data().is_verified) {
          Swal.fire({
            icon: "error",
            text: "You need to verify you email first, check your inbox",
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      setIsLoading(false);
      AlertError(error);
      return;
    }

    await auth
      .signInWithEmailAndPassword(email, password)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            profileUrl: userAuth.user.photoURL,
          })
        );
        window.location.href = "/";
      })
      .catch((error) => {
        setIsLoading(false);
        AlertError(error);
      });
  };

  return (
    <div className="login">
      <Loader visible={isLoading} />
      <h1>Login</h1>
      <img src={loginImg} alt="" />
      <form>
        <OutlinedInput
          value={emailOrUserName}
          onChange={(e) => setEmailOrUserName(e.target.value)}
          placeholder="Email or Username"
          type="email"
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
        <Button variant="contained" type="submit" onClick={loginToApp}>
          Sign In
        </Button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link> &nbsp;
        {parsed.after_register && parsed.email && (
          <Button
            onClick={() => {
              const success = sendVerificationEmail(uuidv4(), parsed.email);
              if (success) {
                Swal.fire("Success re-send verification link!");
              }
            }}
          >
            Re-send verification link
          </Button>
        )}
        &nbsp;
        {parsed && !parsed.after_register && (
          <Link to="/register">
            <span className="login__register">Register Now</span>
          </Link>
        )}
      </p>
    </div>
  );
}

export default Login;
