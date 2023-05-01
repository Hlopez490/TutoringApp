import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useEffect, useState } from "react";

function fetchDays(date, { signal }) {
    let appointment_info; 
    fetch('/tutor_student_info' , {
        method: 'GET'
      })
      .then(res => {
        return res.json();
      })
      .then(data => { 
        appointment_info = data; 
      })
    
    
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = new Date(date).getMonth();
      let daysToHighlight1 = appointment_info.filter((asd) => new Date (asd.start_time).getMonth() === daysInMonth);
      console.log(daysToHighlight1);

      let daysToHighlight2 = daysToHighlight1.map(dates => (new Date(dates.start_time).getDate()))
      daysToHighlight2.unshift(0); 

      const daysToHighlight = daysToHighlight2
      console.log(daysToHighlight); 

      resolve({ daysToHighlight });
    }, 1000);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const initialValue = dayjs(new Date().toDateString());

function ServerDay(props) {

  const { highlightedDays = [], day, outsideCurrentMonth, onClick, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) > 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '⭐' : undefined}
      onClick={() => onClick(day)}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

ServerDay.propTypes = {
  day: PropTypes.object.isRequired,
  highlightedDays: PropTypes.arrayOf(PropTypes.number),

  outsideCurrentMonth: PropTypes.bool.isRequired,

  onClick: PropTypes.func,
};

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([0]);
  const [selectedDayInfo, setSelectedDayInfo] = React.useState(null);

  const [error, setError] = useState(null)
  const [isWarning, setIsWarning] = useState(false)


  
  
  const navigate = useNavigate();

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fetchDays(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDayClick = (day) => {
    fetch('/tutor_student_info' , {
      method: 'GET'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      const clickedDay = new Date(day).getDate();
      let dayInfo = data.filter((asd) => new Date (asd.start_time).getDate() === clickedDay);
      
      setSelectedDayInfo(dayInfo);
    })
  };

  const handleDeleteAppointment = (appointmentInfo) => {
    console.log(appointmentInfo);

    const data = new FormData();
    data.append("start_time", appointmentInfo.start_time)
    data.append("end_time", appointmentInfo.end_time)

    const value = Object.fromEntries(data.entries());
    console.log(appointmentInfo.tutor_id);
    console.log(value);

    fetch('/tutor_dashboard' + appointmentInfo.student_id, {
      method: 'DELETE',
      headers: {
        'Content-type': "application/json",
      },
      body: JSON.stringify(value)
    })
    .then(res => {
      if (res.ok) {
        navigate("/allTutors");
        return res.json();
      } else {
          console.log(res.data)
         throw new Error("Unable to delete appointment. Passed 24 Hours.");
      }
    })
    .then(data => console.log(data))
    .catch(err => {
        console.log(err.message);
      setError(err.message); 
      setIsWarning(true); 

    });
  };

  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
            onClick: handleDayClick,
          },
        }}
      />
      <Container sx = {{py: 8}} maxWidth ="md" columnSpacing={1}>
      <Grid container rowSpacing={2} columnSpacing={1}>
      {selectedDayInfo && selectedDayInfo.map(appointmentInfo => (
          <Grid item key={appointmentInfo} md={6} >
          <div style={{margin: '5%, 5%, 5%, 5%'}}>

          <br/>
            {error?<Alert severity="error">{error}</Alert>:null}
            
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title= { appointmentInfo.student_first_name + ' ' + appointmentInfo.student_last_name } 
              subheader= { appointmentInfo.subject }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Start Time: {
                (new Date(appointmentInfo.start_time ).toLocaleTimeString('en-US', {timeZone: "GMT", hour: 'numeric', minute: 'numeric'}))
                }<br />
                End Time: { 
                (new Date(appointmentInfo.end_time ).toLocaleTimeString('en-US', {timeZone: "GMT", hour: 'numeric', minute: 'numeric'}))
                } <br />
                Email: { appointmentInfo.student_email } <br />
              </Typography>
              <Button size="small" onClick={() =>handleDeleteAppointment(appointmentInfo)}>Delete Appointment</Button>
            </CardContent>
            
          </Card>
          
          </div>
          </Grid>
        ))}
        </Grid>
       </Container>
    </LocalizationProvider>
    
  );
}