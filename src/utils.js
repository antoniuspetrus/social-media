import Spinner from "react-spinner-material";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import Swal from "sweetalert2";

export const openInNewTab = (url) => {
  return () => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
};

export const Loader = ({ visible }) => {
  let displayLoader = "none";
  if (visible === true) {
    displayLoader = "block";
  }
  return (
    <div
      style={{
        width: "100vw",
        height: "110vh",
        position: "absolute",
        zIndex: "9999",
        background: "white",
        display: displayLoader,
        top: "0",
      }}
    >
      <Spinner
        style={{
          position: "absolute",
          top: "calc(50% - 60px)",
          left: "calc(50% - 60px)",
        }}
        radius={120}
        color={"#333"}
        stroke={2}
        visible={visible}
      />
    </div>
  );
};

export const ModalConfirm = ({ visible, onClose, onSubmit }) => {
  return (
    <Dialog
      open={visible}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={onClose}>
          No
        </Button>
        <Button variant="contained" onClick={onSubmit} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AlertError = (text) => {
  let textEl = "Something went wrong!";
  if (text) textEl = text;
  Swal.fire({
    icon: "error",
    text: textEl,
  });
};
