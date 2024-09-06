import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function LogoutDialog({ isOpen, handleClose, handleConfirm }) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: '400px'
        },
      }}
    >
      <DialogTitle>Are You Sure You Want to Logout?</DialogTitle>
      <DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" sx={{
          backgroundColor: "#0B2B47",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0B2B47",
          },
        }}>
          Close
        </Button>
        <Button onClick={handleConfirm} sx={{
          backgroundColor: "#0B2B47",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0B2B47",
          },
        }} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
