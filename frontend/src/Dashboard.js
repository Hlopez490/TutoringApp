import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
    const [authenticated, setauthenticated] = useState(null);
    useEffect(() => {
    const loggedInUser = localStorage.getItem("authenticated");
    console.log(loggedInUser)
    if (loggedInUser) {
    setauthenticated(loggedInUser);
    }
    }, []);
    //Routing back if no authentication
    if (!localStorage.getItem("authenticated")) {
        console.log("I'm Here1")
        return <Navigate replace to="/" />;

    } 
    
    //if authentification actually happened
    else {
        return (
            <div>
                <p>Welcome to your Dashboard</p>
            </div>
            );
    }
    };
    export default Dashboard;