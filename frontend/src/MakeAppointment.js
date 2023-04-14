import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";

const MakeAppointment = (props) => {

    useEffect(() => {
    }, [props.open]);
    
    return (
        <div>
        <Dialog open={props.open}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.tutor.tutor_id}
          </DialogContentText>
        
         </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleClose}>Create Appointment</Button>
        </DialogActions>
      </Dialog>
        </div>
       
    );

}
export default MakeAppointment;