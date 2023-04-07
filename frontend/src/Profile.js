import { useEffect, useState } from "react";
const Profile = () => {
    const [tutors, setTutors] = useState([
        { aboutMe: 'Python Expert', email: 'j@gmail.com', first_name: 'John',last_name: 'My new website',aboutMe: 'My new website', id: 1 },
        { title: 'Welcome party!', body: 'lorem ipsum...', author: 'yoshi', id: 2 }
      ])

  
    return (
      <div className="home">
        <p>Profile page.</p>
		<p><a href="./home">log-out</a></p>
		<p><a href="./dashboard">dashboard</a></p>
      </div>
    );
  }
   
  export default Profile;