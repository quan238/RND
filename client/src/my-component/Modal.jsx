import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "react-bootstrap";

export const CustomModal = ({
  title,
  visible,
  onCancel,
  className,
  ...props
}) => {
  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      fullWidth={true}
      className={className}
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color="info"
          type="button"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={onCancel} color="info" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
