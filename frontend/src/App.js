import {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from './login'
import SignUp from './SignUp'

function App() {

  


  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </Router>
  );
}

export default App;
