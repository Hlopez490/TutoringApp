import { useEffect, useState } from "react";
import TutorList from "./components/TutorList";
import NavBar from "./components/NavBar";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

const AllTutors = () => {
    
    
    const [tutors, setTutors] = useState(null)
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch('/tutorList', {
            method: 'GET'
        
          })
          .then(res => {
            return res.json();
          })
          .then(data => {
            setTutors(data);
          })
      }, [])

  
    return (

      <div className="home">
        <NavBar title ="All Tutors" />
        <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              All Tutors
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Use search bar and filters to help find specific tutors.
            </Typography>
            <div style={{
                    display: "flex",
                    alignSelf: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: 20
                }}>
            <TextField id="search" label="Search..." variant="standard" onChange={(e) => setSearch(e.target.value.toLowerCase())}/>
            </div>
            </Container>
        {tutors && <TutorList tutors={tutors.filter((asd) =>
          asd.first_name.toLowerCase().includes(search) || asd.last_name.toLowerCase().includes(search)
       )} />}
      </div>
    );
  }
   
  export default AllTutors;