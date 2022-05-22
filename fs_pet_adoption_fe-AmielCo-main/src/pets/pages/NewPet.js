import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "../../shared/FormElements/Form.css";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import Form from "react-bootstrap/Form";

const NewPet = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
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
        value: null,
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

  const history = useHistory();

  const petSubmittedHandler = async (e) => {
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

        await sendRequest("http://localhost:8080/pet/", "POST", formData);
        history.push("/");
      
    } catch (err) {}
    };
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="global-form" onSubmit={petSubmittedHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="type"
          element="input"
          type="text"
          label="Type"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />

        <Input
          id="name"
          element="input"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="status"
          element="input"
          label="Status"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid image."
        />
        <Input
          id="height"
          element="input"
          label="Height"
          type="number"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Height."
          onInput={inputHandler}
        />
        <Input
          id="weight"
          element="input"
          label="Weight"
          type="number"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid weight."
          onInput={inputHandler}
        />
        <Input
          id="color"
          element="input"
          type="text"
          label="Color"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid color."
          onInput={inputHandler}
        />
        <Input
          id="bio"
          element="textarea"
          label="Bio"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid bio."
          onInput={inputHandler}
        />
        <Input
          id="hypoallergenic"
          element="input"
          label="Hypoallergenic"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid data."
          onInput={inputHandler}
        />
        <Input
          id="dietary"
          element="input"
          label="Dietary restrictions"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid data."
          onInput={inputHandler}
        />
        <Input
          id="breed"
          element="input"
          label="Breed"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid breed."
          onInput={inputHandler}
        />
        <Button
          type="button"
          onClick={petSubmittedHandler}
          disabled={!formState.isValid}
        >
          ADD PET
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPet;
