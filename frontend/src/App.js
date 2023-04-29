import {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from './login'
import SignUp from './SignUp'
import Dashboard from "./Dashboard";
import AllTutors from './AllTutors';
import FavoriteTutors from './FavoriteTutors';
import MakeAppointment from './MakeAppointment';
import Profile from './Profile'
import BecomeTutor from './BecomeTutor';
import Availability from './Availability';
import ViewTAppoint from './ViewTAppoint'; 
function App() {

  


  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allTutors" element={<AllTutors/>} />
      <Route path="/favoriteTutors" element={<FavoriteTutors/>} />
      <Route path="/makeAppointment" element={<MakeAppointment/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/becomeTutor" element={<BecomeTutor/>} />
      <Route path="/availability" element={<Availability/>} />
      <Route path="/tutorAppointments" element={<ViewTAppoint/>} />

     
    </Routes>
  </Router>
  );
}

export default App;
