import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import Button from "../../FormElements/Button";
import Card from "../../UIElements/Card"
import { Form, ListGroup } from "react-bootstrap";
import PetItem from "../../../pets/components/PetItem";
import "./SearchBox.css";

const SearchBox = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPets, setLoadedPets] = useState([]);
  const [results, setResults] = useState([]);
  const [petType, setPetType] = useState("");
  const [petStatus, setPetStatus] = useState("");
  const [petHeight, setPetHeight] = useState("");
  const [petName, setPetName] = useState("");
  const [petWeight, setPetWeight] = useState("");


  const searchPets = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8080/pet/search?type=${petType}&status=${petStatus}&height=${petHeight}&name=${petName}&weight=${petWeight}`
      );
      setLoadedPets(responseData.pets);
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <div className="c-searchbox__input">
        <form>
          <select
            className="searchbox__input"
            placeholder={"placeholder"}
            type="text"
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
          >
            <option value="">Filter by Type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
          <select
            className="searchbox__input"
            placeholder={"placeholder"}
            type="text"
            value={petStatus}
            onChange={(e) => setPetStatus(e.target.value)}
          >
            <option value="">Filter By Status</option>
            <option value="adoptable">Adoptable</option>
            <option value="fostered">Fostered</option>
            <option value="adopted">Adopted</option>
          </select>

          <input
            className="searchbox__input"
            type="text"
            placeholder="Search by Name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
          <input
            className="searchbox__input"
            placeholder={"Search by Height"}
            type="text"
            value={petHeight}
            onChange={(e) => setPetHeight(e.target.value)}
          />
          <input
            className="searchbox__input"
            placeholder={"Search by Weight"}
            type="text"
            value={petWeight}
            onChange={(e) => setPetWeight(e.target.value)}
          />

          <Button type="button" onClick={searchPets}>
            Search
          </Button>
        </form>

        <ListGroup className="result-box">
          {!loadedPets && alert("No pets found")}
          {loadedPets &&
            loadedPets.map((pet, index) => (
              <div className="center">
                <div className="result-item">
                  <PetItem
                    key={pet.id}
                    type={pet.type}
                    name={pet.name}
                    status={pet.status}
                    image={pet.image}
                    height={pet.height}
                    weight={pet.weight}
                    color={pet.color}
                    bio={pet.bio}
                    hypoallergenic={pet.hypoallergenic}
                    dietary={pet.dietary}
                    breed={pet.breed}
                    id={pet.id}
                    
                  />
                </div>
              </div>
            ))}
        </ListGroup>
      </div>
    </React.Fragment>
  );
};

export default SearchBox;
