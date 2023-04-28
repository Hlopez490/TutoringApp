import * as React from 'react';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';





const BecomeTutorSteps = () => {
  const theme = createTheme();
  const [aboutMe, setAboutMe] = useState("");

  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };


  const navigate = useNavigate();

  //which subjects are liked
  const [state, setState] = React.useState({
    ADVANCED_ALGORITHM: false,
    ARTIFICIAL_INTELLIGENCE: false,
    COMPUTER_ARCHITECTURE: false,
    COMPUTER_NETWORKS: false,
    CS1: false,
    CS2: false,
    DATA_STRUCTURES: false,
    DIGITAL_SYSTEMS: false,
    DISCRETE_MATHEMATICS: false,
    MACHINE_LEARNING: false,
  });

  

  //handle sending info to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    let subjects = "";
    data.append("about", aboutMe)
    console.log(state)
    for (let k in state) {
      console.log(state[k])
      if (state[k]) {
        subjects = subjects.concat(", ", k);
         
      }
  }
  console.log(subjects); 
  data.append("subjects", subjects)
  data.append("image", file)


    
   

    const value = Object.fromEntries(data.entries());

    fetch('/reg_tutor', {
      method: 'POST',
      headers: {
        'Content-type': "application/json",
      },
      body: JSON.stringify(value),
    })
    .then(response => {
      //console.log(request)        
      if (response.ok) {
          //navigate("/");
          return response.json();
        } else {
            console.log(response.data)
           throw new Error("Unable to make appointment. Appointment is either passed or conflicts with your schedule.");
        }
   })
  }

  //changes when switch changes for subject liked
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  
 
  
    return (
      <div className="home">

<ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
            <Box component="form" noValidate  sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                
                <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Step 1: Enter a small Description about yourself.
                  </Typography>
                  <TextField
                    id="outlined-multiline-static"
                    label="About me"
                    multiline
                    rows={10}
                    fullWidth = "true"
                    onChange={(e) => setAboutMe(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Step 2: Check the subjects which you are an expert in.
                  </Typography>

                      <FormControl component="fieldset" variant="standard">
                          <FormLabel component="legend">Check Subjects</FormLabel>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch checked={state.ADVANCED_ALGORITHM} onChange={handleChange} name="ADVANCED_ALGORITHM" />
                              }
                              label="ADVANCED ALGORITHM"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.ARTIFICIAL_INTELLIGENCE} onChange={handleChange} name="ARTIFICIAL_INTELLIGENCE" />
                              }
                              label="ARTIFICIAL INTELLIGENCE "
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.COMPUTER_ARCHITECTURE} onChange={handleChange} name="COMPUTER_ARCHITECTURE" />
                              }
                              label="COMPUTER ARCHITECTURE"
                            />
                             <FormControlLabel
                              control={
                                <Switch checked={state.COMPUTER_NETWORKS} onChange={handleChange} name="COMPUTER_NETWORKS" />
                              }
                              label="COMPUTER NETWORKS"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.CS1} onChange={handleChange} name="CS1" />
                              }
                              label="CS1"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.CS2} onChange={handleChange} name="CS2" />
                              }
                              label="CS2"
                            />
                             <FormControlLabel
                              control={
                                <Switch checked={state.DATA_STRUCTURES} onChange={handleChange} name="DATA_STRUCTURES" />
                              }
                              label="DATA STRUCTURES"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.DIGITAL_SYSTEMS} onChange={handleChange} name="DIGITAL_SYSTEMS" />
                              }
                              label="DIGITAL SYSTEMS"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.DISCRETE_MATHEMATICS} onChange={handleChange} name="DISCRETE_MATHEMATICS" />
                              }
                              label="DISCRETE MATHEMATICS"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={state.MACHINE_LEARNING} onChange={handleChange} name="MACHINE_LEARNING" />
                              }
                              label="MACHINE LEARNING"
                            />
                          </FormGroup>
                        </FormControl>
               
                </Grid>
                <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Step 3: Upload Picture.
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                  >
                    Upload File
                    <input
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleFileChange}
                      type="file"
                      hidden
                    />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                <Button onClick={handleSubmit}  variant="outlined">Submit</Button>  
                <br/> <br/>        
                  
                </Grid>
                
              </Grid>
             
              <Grid container justifyContent="flex-end">
                <Grid item>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
        </Container>
      </ThemeProvider>

         
      
      

      </div>
    );
  }
   
  export default BecomeTutorSteps;