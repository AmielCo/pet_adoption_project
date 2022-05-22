import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PetList from "../components/PetList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";

const UserPets = () => {
  const [loadedPets, setLoadedPets] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/pet/user/${userId}/`
        );
        setLoadedPets(responseData.pets);
      } catch (err) {}
    };
    fetchPets();
  }, [sendRequest, userId]);


  
  const petSaveHandler = (savedPetId) => {
    setLoadedPets((prevPets) => prevPets.filter((p) => p.id === savedPetId));
  }

  const petDeleteHandler = (deletedPetId) => {
    setLoadedPets((prevPets) =>
      prevPets.filter((pet) => pet.id !== deletedPetId)
    );
  };
   

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          {" "}
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && !loadedPets && (
        <Card className="center">
          <div>
           
            <h2>No pets found</h2>
            <Button to="/search">Go to Search</Button>
           
          </div>
        </Card>
      )}
      {!isLoading && loadedPets && (
        <PetList
          items={loadedPets}
          onSavePet={petSaveHandler}
          onDeleteSavedPet={petDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserPets;
