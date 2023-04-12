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
function App() {

  


  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allTutors" element={<AllTutors/>} />
      <Route path="/favoriteTutors" element={<FavoriteTutors/>} />
    </Routes>
  </Router>
  );
}

export default App;
