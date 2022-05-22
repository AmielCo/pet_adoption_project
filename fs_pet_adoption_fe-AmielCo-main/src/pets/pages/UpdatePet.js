import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import {
  VALIDATOR_REQUIRE  
} from "../../shared/util/validators";
import "../../shared/FormElements/Form.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/FormElements/ImageUpload";


const UpdatePet = () => {
  const auth = useContext(AuthContext);
 
  const petId = useParams().pid;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPet, setLoadedUser] = useState();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      type: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },
      status: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      height: {
        value: "",
        isValid: false,
      },
      weight: {
        value: "",
        isValid: false,
      },
      color: {
        value: "",
        isValid: false,
      },
      bio: {
        value: "",
        isValid: false,
      },
      hypoallergenic: {
        value: "",
        isValid: false,
      },
      dietary: {
        value: "",
        isValid: false,
      },
      breed: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/pet/${petId}`
        );
        setLoadedUser(responseData.pet);
        setFormData(
          {
                type: { value: responseData.pet.type, isValid: true },
                name: { value: responseData.pet.name, isValid: true },
                status: { value: responseData.pet.status, isValid: true },
                image: { value: responseData.pet.image, isValid: true },
                height: { value: responseData.pet.height, isValid: true },
                weight: { value: responseData.pet.weight, isValid: true },
                color: { value: responseData.pet.color, isValid: true },
                bio: { value: responseData.pet.bio, isValid: true },
                hypoallergenic: { value: responseData.pet.hypoallergenic, isValid: true },
                dietary: { value: responseData.pet.dietary, isValid: true },
                breed: { value: responseData.pet.breed, isValid: true },

          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, petId, setFormData]);

  const petUpdateSubmittedHandler = async (e) => {
    e.preventDefault();
    if (auth.isAdmin) {
    try {
      const formData = new FormData();
      formData.append("type", formState.inputs.type.value.toLowerCase());
      formData.append("name", formState.inputs.name.value);
      formData.append("status", formState.inputs.status.value.toLowerCase());
      formData.append("image", formState.inputs.image.value);
      formData.append("height", formState.inputs.height.value);
      formData.append("weight", formState.inputs.weight.value);
      formData.append("color", formState.inputs.color.value);
      formData.append("bio", formState.inputs.bio.value);
      formData.append("hypoallergenic", formState.inputs.hypoallergenic.value);
      formData.append("dietary", formState.inputs.dietary.value);
      formData.append("breed", formState.inputs.breed.value);

      await sendRequest(
        `http://localhost:8080/pet/update/${petId}`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
    };
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPet && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find user</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPet && (
        <form className="global-form" onSubmit={petUpdateSubmittedHandler}>
          <Input
            id="type"
            type="text"
            element="input"
            label="Type"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.type}
            initialValid={true}
          />
          <Input
            id="name"
            type="text"
            element="input"
            label="name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.name}
            initialValid={true}
          />

          <Input
            id="status"
            type="text"
            element="input"
            label="status"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.status}
            initialValid={true}
          />
          <ImageUpload
            id="image"
            onInput={inputHandler}
            initialValue={loadedPet.image}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid image."
          />
          <Input
            id="height"
            type="number"
            element="input"
            label="Height"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={loadedPet.height}
            initialValid={true}
          />
          <Input
            id="weight"
            type="number"
            element="input"
            label="Weight"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data (minimum 6 characters)"
            onInput={inputHandler}
            initialValue={loadedPet.weight}
            initialValid={true}
          />
          <Input
            id="color"
            type="text"
            element="input"
            label="Color"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.color}
            initialValid={true}
          />
          <Input
            id="bio"
            type="text"
            element="input"
            label="Bio"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.bio ? loadedPet.bio : ""}
            initialValid={true}
          />

          <Input
            id="hypoallergenic"
            type="text"
            element="input"
            label="hypoallergenic"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.hypoallergenic}
            initialValid={true}
          />
          <Input
            id="dietary"
            type="text"
            element="input"
            label="dietary"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.dietary}
            initialValid={true}
          />
          <Input
            id="breed"
            type="text"
            element="input"
            label="breed"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedPet.breed}
            initialValid={true}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onSubmit={petUpdateSubmittedHandler}
          >
            UPDATE PET
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePet;
