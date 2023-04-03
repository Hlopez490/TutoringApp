import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {useState, useEffect} from 'react'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';





const theme = createTheme();

//export default function login() {
  //const navigate = useNavigate();

  const Login=()=> {
    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [isWarning, setIsWarning] = useState(false)
    const [authenticated, setauthenticated] = useState(
      localStorage.getItem(localStorage.getItem("authenticated") || false)
      );


    
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      netId: data.get('netid'),
      password: data.get('password'),
    });

    const value = Object.fromEntries(data.entries());

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-type': "application/json",
      },
      body: JSON.stringify(value),
    })
    .then(response => {
      //console.log(request)        
      if (response.ok) {
          localStorage.setItem("authenticated", true);
          navigate("/dashboard");
          return response.json();
        } else {
           throw new Error('Incorrect ID or Password');
        }
   })
    .then((data) => console.log(data))
    .catch(err => {
      setError(err.message); 
      setIsWarning(true); 
    });
  };

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
          <div style={{height:"300px"}}>
          <img src={require('./images/logo.png')} alt="logo" />
          </div>
        
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="netid"
              label="Net ID"
              name="netid"
              autoComplete="netid"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="./signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {error?<Alert severity="error">{error}</Alert>:null} 
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
export default Login;