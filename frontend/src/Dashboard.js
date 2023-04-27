import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Calendar from "./components/Calendar";


const Dashboard = () => {

    const [authenticated, setauthenticated] = useState(null);
    const [appointments, setAppointments] = useState(['']);

    useEffect(() => {
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

    }, []);

    //Routing back if no authentication
    if (!localStorage.getItem("authenticated")) {
        console.log("I'm Here1")
        return <Navigate replace to="/" />;
    } 
    
    //if authentification actually happened
    else {
    
        let daysToHighlight = appointments.map(dates => (new Date(dates.start_time).toDateString()))
        console.log(daysToHighlight);

        return (
            <div>
                <NavBar title ="Dashboard" />
                <Calendar />
                <p> Days:: {daysToHighlight} || </p>
            </div>
            );
    }
    };
    export default Dashboard;