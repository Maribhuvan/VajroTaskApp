import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const AlertSnackBar = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackBar;
