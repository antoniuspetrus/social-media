import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { db, storage } from "./firebase";
import { AlertError } from "./utils";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getAuth, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

const Input = styled("input")({
  display: "none",
});

const ModalUpdateProfile = forwardRef(
  ({ userId, onClose, open, existingBio }, ref) => {
    const auth = getAuth();

    const [bio, setBio] = useState(null);
    const [file, setFile] = useState(null);
    const [formValidated, setFormValidated] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
      if (open) {
        if (existingBio) {
          setBio(existingBio);
        } else {
          setBio(null);
        }
        setFile(null);
        setFormValidated(false);
      }
    }, [open]);

    const handleSubmit = (e) => {
      if (!bio || !file) {
        setFormValidated(true);
        return;
      }

      setFormValidated(false);
      onClose();
      db.collection("users")
        .doc(userId)
        .update({
          bio: bio,
        })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          AlertError(err);
        });
    };

    if (!userId) return null;

    let onCloseFn = undefined;
    if (existingBio) {
      onCloseFn = onClose;
    }
    return (
      <Dialog onClose={onCloseFn} open={open}>
        <div
          style={{
            margin: "10px 20px",
          }}
        >
          <DialogTitle>Update profile</DialogTitle>

          {formValidated === true && !bio && (
            <div style={{ color: "red", marginBottom: "15px" }}>
              Bio required
            </div>
          )}
          <TextField
            style={{ marginBottom: "20px" }}
            label="Bio"
            placeholder="Enter your bio"
            multiline
            minRows={3}
            maxRows={Infinity}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
            required
          />

          {formValidated === true && !file && (
            <div style={{ color: "red", marginBottom: "15px" }}>
              Photo required
            </div>
          )}

          {isUploading === true && <div>uploading photo...</div>}
          <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setIsUploading(true);
                    const file = e.target.files[0];

                    storage
                      .ref()
                      .child(`img_${userId}`)
                      .put(file)
                      .then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((url) => {
                          updateProfile(auth.currentUser, {
                            photoURL: url,
                          }).then((res) => {
                            setFile(file);
                            setIsUploading(false);
                          });
                        });
                      });
                  }
                }}
              />
              <Button variant="outlined" component="span">
                Upload Profile Picture &nbsp;
                <PhotoCamera />
              </Button>
            </label>
          </Stack>
          <div style={{ marginTop: "20px" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
);

export default ModalUpdateProfile;
