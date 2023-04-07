import { useEffect, useState } from "react";
const AllTutors = () => {
    
    
    const [tutors, setTutors] = useState([
        { aboutMe: 'Python Expert', email: 'j@gmail.com', first_name: 'John',last_name: 'My new website',aboutMe: 'My new website', id: 1 },
        { title: 'Welcome party!', body: 'lorem ipsum...', author: 'yoshi', id: 2 }
      ])

  
    return (
      <div className="home">
        <p>Hello World</p>
      </div>
    );
  }
   
  export default AllTutors;