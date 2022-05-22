import React, {useContext, useState, useEffect} from 'react';
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import "./UserHomePage.css"
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";



const UserHomePage = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  

  const { sendRequest } = useHttpClient();
  const [showUser, setShowUser] = useState();
  
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/users/${userId}/`
        );
        setShowUser(responseData.user.firstname);
      } catch (err) {}
    };
    fetchUserById();
  }, [sendRequest, userId]);
    
        


  return (
    <React.Fragment>
      <Card className="user-homepage__container">
        <Card className="user-homepage__content">
          <h1>Welcome {showUser}</h1>
          <h2> Thanks for offering them a new home !</h2>
          <div className="center">
            <Button to="/search">Search</Button>
            <Button to={`/pet/user/${auth.userId}`}>MyPets</Button>
            <Button to={`/user/${auth.userId}`}>Settings</Button>
          </div>
        </Card>
      </Card>
    </React.Fragment>
  );
};

export default UserHomePage;
