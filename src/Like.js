import React, { forwardRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Post.css";
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import InputOption from "./InputOption";
import { db } from "./firebase";
import { selectUser } from "./features/userSlice";

const collection = db.collection("post_likes");
const Like = forwardRef(({ postId }, ref) => {
  const user = useSelector(selectUser);

  const [likeNumber, setLikeNumber] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (postId) {
      collection
        .where("post_id", "==", postId)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            console.log("querySnapshot.size: ", querySnapshot.size);
            setLikeNumber(querySnapshot.size);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      collection
        .where("post_id", "==", postId)
        .where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          setLiked(!querySnapshot.empty);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, []);

  if (postId === undefined) {
    return null;
  }

  console.log("user: ", user);
  console.log("postId: ", postId);

  const onClickLike = (e) => {
    console.log("clicked");
    if (liked) {
      // dislike
      collection
        .where("post_id", "==", postId)
        .where("email", "==", user.email)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      setLikeNumber(likeNumber - 1);
      setLiked(false);
    } else {
      // like
      collection.add({
        post_id: postId,
        email: user.email,
      });
      setLikeNumber(likeNumber + 1);
      setLiked(true);
    }
  };

  let likeText = "Like";
  if (likeNumber && likeNumber > 0) {
    likeText += ` (${likeNumber})`;
  }

  let likeColor = "gray";
  if (liked === true) {
    likeColor = "#0a66c2";
  }

  return (
    <Button onClick={onClickLike}>
      <InputOption Icon={ThumbUpIcon} title={likeText} color={likeColor} />
    </Button>
  );
});

export default Like;
