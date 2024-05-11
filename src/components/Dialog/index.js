import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const CustomDialog = ({
  open,
  handleClose,
  title,
  description,
  confirmText,
  cancelText,
  handleConfirm,
  confirmVariant,
  cancelVariant,
  customValue
}) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description} </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color={cancelVariant}>
          {cancelText}
        </Button>
        <Button onClick={() => handleConfirm(customValue)} autoFocus color={confirmVariant}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
