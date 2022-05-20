import React, { useEffect, useState } from "react";
import "./Feed.css";
import InputOption from "./InputOption";
import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Post from "./Post";
import { db } from "./firebase";
import firebase from "firebase/compat/app";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import { Button } from "@mui/material";

function Feed({ userId, userData, email }) {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (email) {
      db.collection("posts")
        .where("creator_email", "==", email)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    } else {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, []);
  const sendPost = (e) => {
    e.preventDefault();

    db.collection("posts").add({
      name: user.displayName,
      message: input,
      photo_url: user.photoUrl || "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      like: 0,
      creator_email: user.email,
      creator_username: userData.username,
    });

    setInput("");
  };

  console.log("posts", posts);
  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input">
          <CreateIcon />
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
            />
            <Button variant="contained" onClick={sendPost} type="submit">
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Posts */}
      <FlipMove>
        {posts.map((data) => {
          return <Post key={data.id} data={data} />;
        })}
      </FlipMove>
    </div>
  );
}

export default Feed;
