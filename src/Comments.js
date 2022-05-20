import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import { db } from "./firebase";
import firebase from "firebase/compat/app";

const collection = db.collection("post_comment");

export default function Comments({
  user,
  visible,
  postId,
  totalComments,
  setTotalComments,
}) {
  const fetchSize = 5;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [fetchedComments, setFetchedComments] = useState(0);
  const [lastSnapShot, setLastSnapShot] = useState(null);

  useEffect(() => {
    if (postId) {
      collection
        .where("post_id", "==", postId)
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            setTotalComments(querySnapshot.size);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      collection
        .where("post_id", "==", postId)
        .orderBy("timestamp", "desc")
        .limit(fetchSize)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const resComments = querySnapshot.docs.map((doc) => ({
              avatar: doc.data().avatar,
              display_name: doc.data().display_name,
              content: doc.data().content,
            }));
            if (resComments && resComments.length > 0) {
              setComments(resComments);
              setFetchedComments(fetchedComments + resComments.length);
              setLastSnapShot(
                querySnapshot.docs[querySnapshot.docs.length - 1]
              );
            }
            console.log("querySnapshot.size: ", querySnapshot.size);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, []);

  const onClickSeeMore = () => {
    if (lastSnapShot) {
      console.log("lastSnapShot");
      console.log(lastSnapShot);
      collection
        .where("post_id", "==", postId)
        .orderBy("timestamp", "desc")
        .startAfter(lastSnapShot)
        .limit(fetchSize)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const resComments = querySnapshot.docs.map((doc) => ({
              avatar: doc.data().avatar,
              display_name: doc.data().display_name,
              content: doc.data().content,
            }));
            if (resComments && resComments.length > 0) {
              setComments([...comments, ...resComments]);
              setFetchedComments(fetchedComments + resComments.length);
              setLastSnapShot(
                querySnapshot.docs[querySnapshot.docs.length - 1]
              );
            }
            console.log("resComments");
            console.log(resComments);
            console.log("querySnapshot.size: ", querySnapshot.size);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  if (!visible) return null;
  if (postId === undefined) {
    return null;
  }

  const handleSubmit = () => {
    if (!content) {
      return;
    }
    if (content && content.length === 0) {
      return;
    }
    const commentObj = {
      post_id: postId,
      email: user.email,
      avatar: user.photoUrl,
      display_name: user.displayName,
      content: content,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.add(commentObj);

    const commentTemp = [...comments];
    commentTemp.unshift(commentObj);
    setComments(commentTemp);

    setFetchedComments(fetchedComments + 1);
    setTotalComments(totalComments + 1);
    setContent("");
  };

  const Comment = ({ avatar, displayName, content }) => {
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={displayName} src={avatar} />
        </ListItemAvatar>
        <ListItemText primary={displayName} secondary={content} />
      </ListItem>
    );
  };

  const countWords = (str) => {
    return str.split(" ").length;
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <div>
        <TextField
          style={{
            display: "flex",
            marginBottom: "15px",
          }}
          placeholder="Add a comment"
          multiline
          minRows={3}
          maxRows={Infinity}
          value={content}
          onChange={(e) => {
            // const words = countWords(e.target.value);
            const chars = e.target.value.length;
            if (chars > 250) {
              return;
            }
            setContent(e.target.value);
          }}
        />
      </div>
      <Button variant="contained" onClick={handleSubmit}>
        Comment
      </Button>
      {comments.map((el, idx) => {
        return (
          <Comment
            key={idx}
            displayName={el.display_name}
            content={el.content}
            avatar={el.avatar}
          />
        );
      })}
      {fetchedComments !== totalComments && (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          <Button variant="contained" onClick={onClickSeeMore}>
            See more
          </Button>
        </div>
      )}
    </List>
  );
}
