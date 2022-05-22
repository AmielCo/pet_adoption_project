import React, { useEffect, useState } from "react";

import PetList from "./PetList";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import { Col, Container, Row } from "react-bootstrap";
import SearchBox from "../../shared/search/components/SearchBox";
import "./AllPets.css";

const AllPets = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPets, setLoadedPets] = useState();
  const [isBasicMode, setIsBasicMode] = useState(true);

  const switchModeHandler = () => {
    setIsBasicMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/pet/search`
        );
        setLoadedPets(responseData.pets);
      } catch (err) {}
    };
    
          fetchPets();

  }, [sendRequest]);

  const showAllPets = async () => {
    try {
      const responseData = await sendRequest("http://localhost:8080/pet");
      setLoadedPets(responseData.pets);
    } catch (err) {}
  };

  const filterPetsByTypeDog = async () => {
    try {
      const responseData = await sendRequest(`http://localhost:8080/pet`);

      setLoadedPets(
        responseData.pets.filter(
          (pet) => pet.type === "dog" || pet.type === "Dog"
        )
      );
    } catch (err) {}
  };

  const filterByTypeCat = async () => {
    try {
      const responseData = await sendRequest(`http://localhost:8080/pet`);
      setLoadedPets(
        responseData.pets.filter(
          (pet) => pet.type === "cat" || pet.type === "Cat"
        )
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="search-page">
        <Card className="center">
          <Button onClick={switchModeHandler}>
            {isBasicMode ? "Switch to advance mode" : "Switch to basic mode"}
          </Button>
        </Card>
        {!isLoading && loadedPets && (
          <Container className="center">
            <Card className="card-petList">
              {isBasicMode && (
                <div>
                  <Button type="button" onClick={filterPetsByTypeDog}>
                    Show All Dogs
                  </Button>
                  <Button type="button" onClick={filterByTypeCat}>
                    Show All Cats
                  </Button>
                  <Button type="button" onClick={showAllPets}>
                    Show All Pets
                  </Button>
                </div>
              )}
              {!isBasicMode && <SearchBox />}
              <h2>All our pets are waiting for you </h2>
              <PetList items={loadedPets} />
            </Card>
          </Container>
        )}
      </div>
    </React.Fragment>
  );
};

export default AllPets;
