import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css";
import { useSelector } from "react-redux";
import { Avatar, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Like from "./Like";
import { db } from "./firebase";
import ModalPostEdit from "./ModalPostEdit";
import { ModalConfirm } from "./utils";
import { selectUser } from "./features/userSlice";
import Comment from "./Comments";
import CommentIcon from "@mui/icons-material/Comment";
import InputOption from "./InputOption";
import moment from "moment";

const collection = db.collection("posts");

const Post = forwardRef((data, ref) => {
  const user = useSelector(selectUser);

  const [anchorEl, setAnchorEl] = useState(null);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [totalComments, setTotalComments] = useState(0);

  const [isMyPost, setIsMyPost] = useState(false);

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalEditOpen = () => {
    setModalEditVisible(true);
    handleClose();
  };

  const handleModalDeleteOpen = () => {
    setModalDeleteVisible(true);
    handleClose();
  };

  useEffect(() => {
    collection
      .doc(postId)
      .get()
      .then(function (doc) {
        setIsMyPost(doc.data().creator_email === user.email);
      });
  }, []);

  const handleDelete = (postId) => {
    return () => {
      collection
        .doc(postId)
        .get()
        .then(function (doc) {
          if (isMyPost) {
            doc.ref.delete();
          }
        });
    };
  };

  let content = data.data;
  let postId = content.id;
  console.log("content", content);
  console.log("postId", postId);

  // let creatorName = content.data.creator_email;

  let avatarURL = "";
  let creatorFirstLetter = "";
  let creatorUserName = "";
  let postTimestamp = "";
  if (content && content.data) {
    if (content.data.name && content.data.name.length > 0) {
      // creatorName = content.data.name;
      creatorFirstLetter = content.data.name[0];
    }
    if (content.data.creator_username) {
      creatorUserName = content.data.creator_username;
    }
    if (content.data.photo_url) {
      avatarURL = content.data.photo_url || "";
    }
    if (content.data.timestamp && content.data.timestamp.seconds) {
      postTimestamp = moment
        .unix(content.data.timestamp.seconds)
        .format("DD-MM-YYYY HH:mm");
    }
  }

  return (
    <div ref={ref} className="post">
      <ModalPostEdit
        selectedValue={content}
        open={modalEditVisible}
        onClose={() => {
          setModalEditVisible(false);
        }}
      />
      <ModalConfirm
        visible={modalDeleteVisible}
        onClose={() => {
          setModalDeleteVisible(false);
          handleClose();
        }}
        onSubmit={handleDelete(postId)}
      />
      <div className="post__header">
        <Avatar src={avatarURL}>{creatorFirstLetter}</Avatar>
        <div className="post__info">
          {/* <h2>{creatorName}</h2>
          <p>{creatorUserName}</p> */}

          <h2>{creatorUserName}</h2>
          <p>{postTimestamp}</p>
        </div>

        {isMyPost === true && (
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            style={{
              position: "absolute",
              right: "0",
            }}
          >
            <MoreVertIcon />
          </Button>
        )}
      </div>
      <div className="post__body">
        <p>{content.data.message}</p>
      </div>
      <div className="post__buttons">
        {isMyPost === true && (
          <>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleModalEditOpen}>Edit</MenuItem>
              <MenuItem onClick={handleModalDeleteOpen}>Delete</MenuItem>
            </Menu>
          </>
        )}
        <Like postId={postId} />

        <Button
          onClick={() => {
            setCommentVisible(!commentVisible);
          }}
        >
          <InputOption
            Icon={CommentIcon}
            title={`COMMENTS${
              totalComments > 0 ? " (" + totalComments + ")" : ""
            }`}
            color={"grey"}
          />
        </Button>
      </div>
      <Comment
        user={user}
        visible={commentVisible}
        postId={postId}
        totalComments={totalComments}
        setTotalComments={setTotalComments}
      />
    </div>
  );
});

export default Post;
