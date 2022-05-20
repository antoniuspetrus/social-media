import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { login, logout, selectUser } from "./features/userSlice";
import Feed from "./Feed";
import { auth, db } from "./firebase";
import Header from "./Header";
import Login from "./Login";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  withRouter,
} from "react-router-dom";
import Register from "./Register";
import VerifyAccount from "./VerifyAccount";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Swal from "sweetalert2";

function App() {
  const [reduxLoaded, setReduxLoaded] = useState(false);
  const [userData, setUserData] = useState(null); // in firestore
  const [userId, setUserId] = useState(null);
  const [userVerified, setUserVerified] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("window.location");
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // user is logged in
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          })
        );
      } else {
        // user is logged out
        dispatch(logout());
      }
      setReduxLoaded(true);
    });
  }, [0]);

  useEffect(() => {
    if (reduxLoaded === true && user) {
      db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((querySnapshotUser) => {
          if (
            !querySnapshotUser.empty &&
            querySnapshotUser.docs &&
            querySnapshotUser.docs[0] &&
            querySnapshotUser.docs[0].data()
          ) {
            setUserId(querySnapshotUser.docs[0].id);
            setUserData(querySnapshotUser.docs[0].data());
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      db.collection("email_verification")
        .where("email", "==", user.email)
        .orderBy("created_at", "desc")
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            setUserVerified(querySnapshot.docs[0].data().is_verified);
          }
        });
    }
  }, [reduxLoaded]);

  const isPrivateRoute = () => {
    return (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register" &&
      window.location.pathname !== "/forgot-password" &&
      window.location.pathname !== "/verify-account"
    );
  };

  const isPublicRoute = () => {
    return (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/forgot-password" ||
      window.location.pathname === "/verify-account"
    );
  };

  const Layout = (Component, compProps) => {
    if (!user) return null;

    return (
      <>
        <Header />
        <div className="app__body">
          <Sidebar userData={userData} userId={userId} />
          <Component userData={userData} userId={userId} {...compProps} />
          <Widgets />
        </div>
      </>
    );
  };

  if (reduxLoaded === true) {
    if (isPrivateRoute() && !user) {
      window.location.href = "/login";
      return;
    }

    if (isPublicRoute() && user && userData && userVerified) {
      window.location.href = "/";
      return;
    }
  }

  let myPageProps = {};
  if (user) {
    if (user.email) myPageProps.email = user.email;
  }
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={Layout(Feed)}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-page" element={Layout(Feed, { ...myPageProps })} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
