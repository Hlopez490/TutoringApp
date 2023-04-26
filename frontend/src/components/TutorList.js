import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import MakeAppointment from '../MakeAppointment';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { Delete } from '@mui/icons-material';


const TutorList = ({ tutors, fav }) => {
  const navigate = useNavigate();
    useEffect(() => {
    }, [tutors]);
    const [open, setOpen] = React.useState(false);
    const [tutorP, setTutorP] = React.useState("");

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

  const handleClose = () => {
    setOpen(false);
  };

    return (
        
      <div className="blog-list">
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
                {fav && <IconButton aria-label="add to favorites">
                    <DeleteIcon />
                </IconButton>}
                <Button size="small" onClick={() =>handleClickOpen(tutor)}>Book Appointment</Button>
            </CardActions>
            
          </Card>
          
          </div>
          </Grid>
         
        ))}
       </Grid>
       </Container>
       
      </div>
      
      
      
    );
  }
   
  export default TutorList;