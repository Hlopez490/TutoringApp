import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import TutorCalendar from "./components/TutorCalendar"
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const ViewTAppoint = () => {

    const [authenticated, setauthenticated] = useState(null);
    const [appointments, setAppointments] = useState(['']);

   /* useEffect(() => {
        const loggedInUser = localStorage.getItem("authenticated");
        console.log(loggedInUser)
        if (loggedInUser) {
            setauthenticated(loggedInUser);
        }

        fetch('/student-appointment-info' , {
            method: 'GET'
          })
          .then(res => {
            return res.json();
          })
          .then(data => { 
            setAppointments(data);
          })

    }, []); */

    //Routing back if no authentication
    if (!localStorage.getItem("authenticated")) {
        console.log("I'm Here1")
        return <Navigate replace to="/" />;
    } 
    
    //if authentification actually happened
    else {
    
        //let startTime = appointments.map(dates => (new Date(dates.start_time).toDateString()));
       // let endTime = appointments.map(dates => (new Date(dates.end_time).toDateString()));

        return (
            <div>
                <NavBar title ="View Tutor Appointments" />
                <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              View Tutor Appointments
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Use calendar to view your past and upcoming sessions as a tutor.
            </Typography>
            </Container>
                <TutorCalendar />
            </div>
            );
    }
    };
    export default ViewTAppoint;