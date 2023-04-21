import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const MakeAppointment = () => {

  const [appointments, setAppointments] = useState(null)

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
  }, []);

  console.log(location);
  
    
    return (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider>
          {location.state.tutorS.tutor_id}

          {appointments && <h1> {new Date(appointments[1].start_time).getDate()} </h1> }
        </div>
       
    );

}
export default MakeAppointment;