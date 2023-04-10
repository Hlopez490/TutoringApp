import { useEffect, useState } from "react";
import TutorList from "./components/TutorList";
import NavBar from "./components/NavBar";
const AllTutors = () => {
    
    
    const [tutors, setTutors] = useState(null)

    useEffect(() => {
        fetch('/tutorList', {
            method: 'GET'
        
          })
          .then(res => {
            return res.json();
          })
          .then(data => {
            setTutors(data);
          })
      }, [])

  
    return (
      <div className="home">
        <NavBar title ="All Tutors" />
        {tutors && <TutorList tutors={tutors} />}
      </div>
    );
  }
   
  export default AllTutors;