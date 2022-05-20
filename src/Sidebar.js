import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import "./Sidebar.css";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";
import { db } from "./firebase";
import ModalUpdateProfile from "./ModalUpdateProfile";

function Sidebar({ userData, userId }) {
  const user = useSelector(selectUser);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [existingBio, setExistingBio] = useState(false);

  useEffect(() => {
    if (!user || !user.email || user.email.length === 0) {
      return;
    }
  }, []);

  useEffect(() => {
    if (userData) {
      if (!userData.bio) {
        setModalProfileVisible(true);
      }
    }
  }, [userData]);

  const recentItem = (topic) => (
    <div className="sidebar__recentItem">
      <span className="sidebar__hash">#</span>
      <p>{topic}</p>
    </div>
  );

  let userNameEl = null;
  let bioEl = null;
  if (userData) {
    if (userData.username) {
      userNameEl = (
        <div className="sidebar__stat">
          <p>Username</p>
          <p className="sidebar__statNumber">{userData.username}</p>
        </div>
      );
    }
    if (userData.bio) {
      bioEl = (
        <div className="sidebar__stat">
          <p>Bio</p>
          <p className="sidebar__statNumber">{userData.bio}</p>
        </div>
      );
    }
  }

  // var storageRef = firebase.storage().ref();

  return (
    <div className="sidebar">
      <ModalUpdateProfile
        userId={userId}
        open={modalProfileVisible}
        onClose={() => {
          setModalProfileVisible(false);
        }}
        existingBio={existingBio}
      />
      <div className="sidebar__top">
        <img
          src="https://images.unsplash.com/photo-1650536473125-b68f1d4eb65d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt=""
        />
        <a href="/my-page">
          <Avatar src={user.photoUrl} className="sidebar__avatar">
            {user.email[0]}
          </Avatar>
        </a>
        <h2>{user.displayName}</h2>
        <h4>{user.email}</h4>
      </div>

      <div className="sidebar__stats">
        {userNameEl}
        {bioEl}
        <div className="sidebar__stat">
          <Button style={{
            width: "100%"
          }}
            variant="contained"
            onClick={() => {
              setModalProfileVisible(true);
              if (userData.bio) setExistingBio(userData.bio);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="sidebar__bottom">
        <p>Recent</p>
        {recentItem("reactjs")}
        {recentItem("javascript")}
        {recentItem("programming")}
        {recentItem("HTML")}
        {recentItem("CSS")}
      </div>
    </div>
  );
}

export default Sidebar;
