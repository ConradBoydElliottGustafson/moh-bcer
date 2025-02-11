import React from 'react';
import { Snackbar } from '@material-ui/core';

interface IProps {
  open: boolean;
  message: string;
}
export default function Loader({ open, message }: IProps) {
  return (
    <Snackbar
      open={open}
      message={message}
      ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
    />
  );
}

Loader.defaultProps = {
  open: false,
  message: '',
};
