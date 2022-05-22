import React from "react";

import "./PetList.css";
import PetItem from "./PetItem";
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";



const PetList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="pet-list center">
        <Card>
         
          <h2>
            No pets found. Save one for later, or if you feel like it adopt one
            or foster one
          </h2>
          <Button to="/search">To Search page</Button>
        </Card>
      </div>
    );
  }
  return (
    
    <ul className="pet-list">
      {props.items.map((pet) => (
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
          owned={pet.owned}
          onSave={props.onSavePet}
          onDelete={props.onDeleteSavedPet}
        />
      ))}
    </ul>
  );
};

export default PetList;
