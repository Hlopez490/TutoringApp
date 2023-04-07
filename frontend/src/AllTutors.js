import { useEffect, useState } from "react";
import TutorList from "./components/TutorList";
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
        {tutors && <TutorList tutors={tutors} />}
      </div>
    );
  }
   
  export default AllTutors;