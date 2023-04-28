import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { arrayIncludes } from '@mui/x-date-pickers/internals/utils/utils';

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date, { signal }) {
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
    fakeFetch(date, {
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
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
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
      setSelectedDayInfo(dayInfo);
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
      {selectedDayInfo && (
      <div>
        <h3>Appointment Information:</h3>
        <p>EndTime: {selectedDayInfo[0].end_time}</p>
        <p>StartTime: {selectedDayInfo[0].start_time}</p>
        <p>TutorPhone: {selectedDayInfo[0].tutor_phone}</p>
      </div>
    )}
    </LocalizationProvider>
    
  );
}