import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppointmentList from "./components/AppointmentList";
import NavBar from "./components/NavBar";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';




const MakeAppointment = () => {

  const [appointments, setAppointments] = useState(null)
  const [appointmentsOnDay, setAppointmentsOnDay] = useState(null)
  const [value, setValue] = React.useState(null);
  const [subject, setSubject] = React.useState('');


 


  const location = useLocation();
  useEffect(() => {
    fetch('/availability/' +  location.state.tutorS.tutor_id , {
        method: 'GET'
    
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        console.log(data); 
      })
  }, [location.state.tutorS.tutor_id]);

  const handleChange = (newValue) => { 
    setValue(newValue);
    console.log(new Date(newValue).getDate())
    
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

 


  
    
    return (
      <div className="home">
        <NavBar title ="Make Appointment" />
        <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Make Appointment
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Pick date, subject, and time to create an appointment.
            </Typography>
        <div>
        <Grid container spacing={2}>
        <Grid xs={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker value={value} onChange={(newValue) => handleChange(newValue)} label="Pick Date" />
      </DemoContainer>
    </LocalizationProvider>
    </Grid>

    <Grid xs={4}>
    <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-required-label">Subject</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={subject}
          label="Subject *"
          onChange={handleSubjectChange}
        >
          {location.state.tutorS.subjects.map(subject => (
            <MenuItem key={subject} value={subject}>
            {subject}
          </MenuItem>
          ))}
          
        </Select>
        <FormHelperText>Required</FormHelperText>

      </FormControl>
      </Grid>


      </Grid>



      <div style={{alignItems: "center"}}>
      {subject && value && appointments && <AppointmentList subject ={subject} tutor ={location.state.tutorS}  appointments ={appointments.filter ((asd) =>
         new Date (asd.start_time).getDate() === (new Date(value).getDate()) && 
         new Date (asd.start_time).getMonth() === (new Date(value).getMonth()) &&
         new Date (asd.start_time).getYear() === (new Date(value).getYear()) 
         
         )}/>}
         </div>
          {console.log(appointments)}
        </div>
        
        </Container>
        </div>
       
       
    );

}
export default MakeAppointment;