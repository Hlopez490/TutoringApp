import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ProfileInfo from "./components/ProfileInfo"

const Profile = () => {

  const [info, setInfo] = useState(null)
   
  useEffect(() => {
    fetch('/profile', {
        method: 'GET'
    
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setInfo(data);
        console.log(data)
      })
  }, [])



  
    return (
      <div className="home">
        <NavBar title ="Profile" />

        <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Profile
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              View Profile Information.
            </Typography>
          </Container>


          {info && <ProfileInfo info = {info} />}






      </div>
    );
  }
   
  export default Profile;