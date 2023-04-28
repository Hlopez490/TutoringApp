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


const theme = createTheme();
const ProfileInfo = ({ info }) => {

    const navigate = useNavigate();
    

    useEffect(() => {
    }, [info]);

    return (

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
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled
                    id="fn"
                    label="First Name"
                    defaultValue={info[0].first_name}
                    variant="filled"
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    disabled
                    id="ln"
                    label="Last Name"
                    defaultValue={info[0].last_name}
                    variant="filled"
                />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    id="ni"
                    label="Net ID"
                    defaultValue={info[0].student_id}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    disabled
                    fullWidth
                    id="em"
                    label="Email"
                    defaultValue={info[0].email}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    disabled
                    fullWidth
                    id="ph"
                    label="phone"
                    defaultValue={info[0].phone}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    disabled
                    fullWidth
                    id="mi"
                    label="hours tutored"
                    defaultValue={(info[0].minutes_tutored/60)}
                    variant="filled"
                  />
                </Grid>
                
              </Grid>
              {console.log(info[0].IsTutor)}
              {!info[0].IsTutor && 
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => (navigate("/becomeTutor"))}
              >
                Become Tutor
              </Button> }
              {info[0].IsTutor && 
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => (navigate("/availability"))}
              >
                Update Availability
              </Button> }
              <Grid container justifyContent="flex-end">
                <Grid item>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
        </Container>
      </ThemeProvider>



    ); 
}
export default ProfileInfo; 