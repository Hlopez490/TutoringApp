import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Alert from '@mui/material/Alert';



const TutorList = ({ tutors, fav }) => {
  const navigate = useNavigate();
    useEffect(() => {
    }, [tutors]);
    const [open, setOpen] = React.useState(false);
    const [favOpen, setFavOpen] = React.useState(false);
    const [tutorP, setTutorP] = React.useState("");
    const [error, setError] = useState(null)
    const [isWarning, setIsWarning] = useState(false)

    //handling the deletion
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData();
      data.append("tutor_id", tutorP.tutor_id)

  
  
      const value = Object.fromEntries(data.entries());
  
      fetch('/favorites', {
        method: 'DELETE',
        headers: {
          'Content-type': "application/json",
        },
        body: JSON.stringify(value),
      })
      .then(response => {
        //console.log(request)        
        if (response.ok) {
            navigate("/dashboard");
            return response.json();
          } else {
             throw new Error('Unable to make appointment');
          }
     })
      .then((data) => console.log(data))
      
    };




    //handling adding tutors to favorites
    const handleAddFavorite = (event) => {
      event.preventDefault();
      const data = new FormData();
      data.append("tutor_id", tutorP.tutor_id)

  
  
      const value = Object.fromEntries(data.entries());
  
      fetch('/favorites', {
        method: 'POST',
        headers: {
          'Content-type': "application/json",
        },
        body: JSON.stringify(value),
      })
      .then(response => {
        //console.log(request)        
        if (response.ok) {
            navigate("/dashboard");
            return response.json();
          } else {
             throw new Error('Already in favorites');
          }
     })
      .then((data) => console.log(data))
      .catch(err => {
        console.log(err.message);
        setError(err.message); 
        setIsWarning(true); 
        setFavOpen(false); 
    });
      
    };








  const handleClickOpen = (tutor) => {
    setTutorP(tutor); 
    setOpen(true);
    console.log(tutor)
    navigate("/makeAppointment", {
      state: {
        tutorS: tutor
      }
    }); 
    
  };

  //opens remove confirmation
  const handleDialogOpen = (tutor) => {
    setTutorP(tutor); 
    setOpen(true);
    
  };

  //function to open conformation for adding to favrite
  const handleAddFavoriteDiaglogOpen = (tutor) => {
    setTutorP(tutor); 
    setFavOpen(true)
  }

  //closes adding favorite confirmation
  const handleAddFavoriteDiaglogClose = (tutor) => { 
    setFavOpen(false)
  }
  //closes remove confirmation
  const handleClose = () => {
    setOpen(false);
  };

    return (
        
      <div className="blog-list">
                    {error?<Alert severity="error">{error}</Alert>:null} 

        <Container sx = {{py: 8}} maxWidth ="md" columnSpacing={1}>
        <Grid container rowSpacing={2} columnSpacing={1}>
        {tutors.map(tutor => (
          <Grid item key={tutor} md={6} >
          <div style={{margin: '5%, 5%, 5%, 5%'}}>
            
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={
                <Avatar alt={tutor.first_name}  src={require('../../../backend/src/static/images/' + tutor.profile_pic)} />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title= { tutor.first_name + ' ' + tutor.last_name } 
              subheader= { tutor.email }
              
            />
            <CardContent>
                {tutor.subjects.map(subject => (
                    <Chip label={ subject } size = "small" />

                ))} <br/><br/>
              <Typography variant="body2" color="text.secondary">
                Phone: { tutor.phone } <br />
              { tutor.about_me } <br/>
              </Typography>
            </CardContent>
            <CardActions>
                {fav && <IconButton onClick={() =>handleDialogOpen(tutor)} aria-label="add to favorites">
                    <DeleteIcon />
                </IconButton>}
                {!fav && <IconButton  onClick={() =>handleAddFavoriteDiaglogOpen(tutor)} aria-label="add to favorites">
                    <PersonAddIcon />
                </IconButton>}
                <Button size="small" onClick={() =>handleClickOpen(tutor)}>Book Appointment</Button>
            </CardActions>
            
          </Card>
          
          </div>
          </Grid>
         
        ))}
       </Grid>
       </Container>






       <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click confirm to remove tutor from favorite
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


        
      <Dialog
        open={favOpen}
        onClose={handleAddFavoriteDiaglogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click confirm to add tutor to favorites
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddFavoriteDiaglogClose}>Cancel</Button>
          <Button onClick={handleAddFavorite} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
       
      </div>
      
      
      
    );
  }
   
  export default TutorList;