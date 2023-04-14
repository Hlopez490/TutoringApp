import { useEffect, useState } from "react";
import TutorList from "./components/TutorList";
import NavBar from "./components/NavBar";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';




const AllTutors = () => {
    
    
    const [tutors, setTutors] = useState(null)
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState([""]); 

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

      const handleChange = (event) => {
        setSubject(event.target.value);
      };
    

  
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
            <TextField id="search" label="Name" variant="standard" onChange={(e) => setSearch(e.target.value.toLowerCase())}/> <br/>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Subject</InputLabel>
            <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={subject}
          onChange={handleChange}
          label="Subject"
        >
          <MenuItem value="">
            <em>none</em>
          </MenuItem>
          <MenuItem value={"ADVANCED ALGORITHM"}>ADVANCED ALGORITHM</MenuItem>
          <MenuItem value={"\tARTIFICIAL INTELLIGENCE"}>ARTIFICIAL INTELLIGENCE</MenuItem>
          <MenuItem value={"COMPUTER ARCHITECTURE"}>COMPUTER ARCHITECTURE</MenuItem>
          <MenuItem value={"COMPUTER NETWORKS"}>COMPUTER NETWORKS</MenuItem>
          <MenuItem value={"CS1"}>CS1</MenuItem>
          <MenuItem value={"CS2"}>CS2</MenuItem>
          <MenuItem value={"DATA STRUCTURES"}>DATA STRUCTURES</MenuItem>
          <MenuItem value={"DIGITAL SYSTEMS"}>DIGITAL SYSTEMS</MenuItem>
          <MenuItem value={"DISCRETE MATHEMATICS"}>DISCRETE MATHEMATICS</MenuItem>
          <MenuItem value={"MACHINE LEARNING"}>MACHINE LEARNING</MenuItem>

        </Select>
        </FormControl>
            </div>
            </Container>
        {tutors && <TutorList tutors={tutors.filter((asd) => 
        (asd.subjects.includes(subject) || asd.subjects[1].includes(subject)) && (asd.first_name.toLowerCase().includes(search) || asd.last_name.toLowerCase().includes(search)) 
       )} />}
      </div>
    );
  }
   
  export default AllTutors;