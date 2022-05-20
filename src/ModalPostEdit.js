import React, { forwardRef, useState } from "react";
import "./Post.css";
import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { db } from "./firebase";

const collection = db.collection("posts");

const ModalPostEdit = forwardRef(({ onClose, selectedValue, open }, ref) => {
  let defaultContent = "";
  if (selectedValue && selectedValue.data && selectedValue.data.message) {
    defaultContent = selectedValue.data.message;
  }
  const [content, setContent] = useState(defaultContent);
  const postId = selectedValue.id;

  const handleSubmit = (e) => {
    collection
      .doc(postId)
      .update({
        message: content,
      })
      .then((res) => {
        onClose();
      });
  };

  console.log("selectedValue", selectedValue);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Post</DialogTitle>
      <TextField
        placeholder="Share your thoughts"
        multiline
        minRows={3}
        maxRows={Infinity}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <Button variant="contained" onClick={handleSubmit}>Edit</Button>
    </Dialog>
  );
});

export default ModalPostEdit;
