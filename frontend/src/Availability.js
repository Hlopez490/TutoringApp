import * as React from 'react';
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';




const Availability = () => {
    const navigate = useNavigate();

    const [start, setStart] = React.useState(null)
    const [end, setEnd] = React.useState(null)

    const [error, setError] = useState(null)
    const [isWarning, setIsWarning] = useState(false)



      const handleSubmit = (event) => {
        console.log(start.$d)
        console.log(end.$d)

        const data = new FormData();
        data.append("start_time", start.$d)
        data.append("end_time", end.$d)


        const value = Object.fromEntries(data.entries());




        fetch('/availability', {
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
                  console.log(response.data)
                 throw new Error("Unable to make availability. Either invalid time range or time conflict.");
              }
         })
          .then((data) => console.log(data))
          .catch(err => {
              console.log(err.message);
            setError(err.message); 
            setIsWarning(true); 
            
          });


      }

    return (
      <div className="home">
        <NavBar title ="Profile" />

    <Container maxWidth="sm">
        <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
        >
            Update Availability
    </Typography>
    <Typography variant="h5" align="center" color="text.secondary" paragraph>
      Select time and date to make an availability for an appointment.
    </Typography>



    {error?<Alert severity="error">{error}</Alert>:null} 

 <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker value={start} onChange={(newStart) => setStart(newStart)} label="Start Time" />
        <DateTimePicker value={end} onChange={(newEnd) => setEnd(newEnd)} label="End Time" />
      </DemoContainer>
    </LocalizationProvider>
    <br/> 

    {start && end && <Button onClick={handleSubmit} variant="outlined">Submit</Button>}




    </Container>




      </div>
    );
  }
   
  export default Availability;