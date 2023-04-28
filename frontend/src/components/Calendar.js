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


function fetchDays(date, { signal }) {
    let appointment_info; 
    fetch('/student-appointment-info' , {
        method: 'GET'
      })
      .then(res => {
        return res.json();
      })
      .then(data => { 
        appointment_info = data; 
        //console.log(data); 
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

      //const daysInMonth = date.daysInMonth();
      //const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));
      //console.log("Days to Highlight: " + daysToHighlight)
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
  /**
   * The date to show.
   */
  day: PropTypes.object.isRequired,
  highlightedDays: PropTypes.arrayOf(PropTypes.number),
  /**
   * If `true`, day is outside of month and will be hidden.
   */
  outsideCurrentMonth: PropTypes.bool.isRequired,
  /**
   * Callback fired when the day is clicked.
   */
  onClick: PropTypes.func,
};

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [selectedDayInfo, setSelectedDayInfo] = React.useState(null);

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
    fetch('/student-appointment-info' , {
      method: 'GET'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      const clickedDay = new Date(day).getDate();
      let dayInfo = data.filter((asd) => new Date (asd.start_time).getDate() === clickedDay);
      console.log((new Date(dayInfo[0].start_time)).toLocaleTimeString('en-US',{ hour: 'numeric', minute: 'numeric'}));
      setSelectedDayInfo(dayInfo);
    })
  };

  const handleDeleteAppointment = (appointmentInfo) => {
    fetch('/student-appointment-info' , {
      method: 'GET'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
    })
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
      <Grid container rowSpacing={2} columnSpacing={1}>
      {selectedDayInfo && selectedDayInfo.map(appointmentInfo => (
            <Grid item key={appointmentInfo} md={6} >
          <div style={{margin: '5%, 5%, 5%, 5%'}}>
            
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title= { appointmentInfo.tutor_first_name + ' ' + appointmentInfo.tutor_last_name } 
              subheader= { appointmentInfo.subject }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Start Time: {
                (new Date(appointmentInfo.start_time ).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric'}))
                }<br />
                End Time: { 
                (new Date(appointmentInfo.end_time ).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric'}))
                } <br />
                Email: { appointmentInfo.tutor_email } <br />
              </Typography>
              <Button size="small" onClick={() =>handleDeleteAppointment(appointmentInfo)}>Delete Appointment</Button>
            </CardContent>
            
          </Card>
          
          </div>
          </Grid>
        ))}
        </Grid>
    </LocalizationProvider>
    
  );
}