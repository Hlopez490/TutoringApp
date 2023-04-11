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




const TutorList = ({ tutors }) => {
    useEffect(() => {
    }, [tutors]);
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
              { tutor.about_me }
              </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <Button size="small">Book Appointment</Button>
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