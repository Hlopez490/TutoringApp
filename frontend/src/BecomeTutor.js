import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import BecomeTutorSteps from "./components/BecomeTutorSteps";

//page to become a tutor
const BecomeTutor = () => {

    
    return (
      <div className="home">
            <NavBar title ="Become Tutor" />

            <Container maxWidth="sm">
                <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
                >
                Become Tutor
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Follow steps to register account as a tutor.
                </Typography>
            </Container>

            <BecomeTutorSteps />






      </div>
    );
  }
   
  export default BecomeTutor;