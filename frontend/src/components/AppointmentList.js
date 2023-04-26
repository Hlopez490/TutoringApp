import * as React from 'react';
import { useEffect, useState } from "react";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from "react-router-dom";



const AppointmentList = ({ appointments, tutor, subject }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
    }, [appointments]);

    const [open, setOpen] = React.useState(false);
    const [appointment, setAppointment] = React.useState(null);



    const handleClickOpen = (appointment) => {
        setAppointment(appointment)
        setOpen(true);
      };


  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("start_time", appointment.start_time)
    data.append("end_time", appointment.end_time)
    data.append("subject", subject)

    
   

    const value = Object.fromEntries(data.entries());

    fetch('/appointment/' + tutor.tutor_id, {
      method: 'POST',
      headers: {
        'Content-type': "application/json",
      },
      body: JSON.stringify(value),
    })
    .then(response => {
      //console.log(request)        
      if (response.ok) {
          navigate("/dashboard");
          return response.json();
        } else {
           throw new Error('Unable to make appointment');
        }
   })
    .then((data) => console.log(data))
    .catch(err => {
      setError(err.message); 
      setIsWarning(true); 
    });
  };

    return (
        <div>
        
            <Stack spacing={2} >

                {appointments.map(appointment => (
                    <div>
                        <Button onClick={() =>handleClickOpen(appointment)} variant="outlined">{new Date (appointment.start_time).toTimeString().substring(0,5) + "-" + new Date (appointment.end_time).toTimeString().substring(0,5)}</Button>

                    </div>
                )) }
            </Stack>



            <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click confirm to set appointment
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
        </div>
    

   
    )
  

}
export default AppointmentList;