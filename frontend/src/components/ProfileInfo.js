import * as React from 'react';
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';


const theme = createTheme();
const ProfileInfo = ({ info }) => {

    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [isWarning, setIsWarning] = useState(false)

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
                
              </Grid>
              {!info.IsTutor && <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Become Tutor
              </Button> }
              <Grid container justifyContent="flex-end">
                <Grid item>
                </Grid>
              </Grid>
              {error?<Alert severity="error">{error}</Alert>:null} 
            </Box>
          </Box>
          
        </Container>
      </ThemeProvider>



    ); 
}
export default ProfileInfo; 