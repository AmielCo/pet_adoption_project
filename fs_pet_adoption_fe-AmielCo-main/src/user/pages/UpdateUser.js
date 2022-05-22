import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import "../../shared/FormElements/Form.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const history = useHistory()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      firstname: {
        value: "",
        isValid: false,
      },
      lastname: {
        value: "",
        isValid: false,
      },
      phonenumber: {
        value: "",
        isValid: false,
      },
      bio: {
        value: "",

        isValid: false,
      },
      password: {
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
          `http://localhost:8080/users/${userId}`
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            email: {
              value: responseData.user.email,
              isValid: true,
            },
            firstname: {
              value: responseData.user.firstname,
              isValid: true,
            },
            lastname: {
              value: responseData.user.lastname,
              isValid: true,
            },
            phonenumber: {
              value: responseData.user.phonenumber,
              isValid: true,
            },
            bio: {
              value: (responseData.user.bio ? responseData.user.bio : ""),
              isValid: true,
            },
            password: {
              value: responseData.user.password,
              isValid: true,
            },
          },
          true
        );
     
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId, setFormData]);


  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:8080/users/${userId}`, "PUT", JSON.stringify({
        email: formState.inputs.email.value,
        firstname: formState.inputs.firstname.value,
        lastname: formState.inputs.lastname.value,
        phonenumber: formState.inputs.phonenumber.value,
        bio: formState.inputs.bio.value,
        password: formState.inputs.password.value,
      }), {
        "Content-Type": "application/json", "Authorization": "Bearer " + auth.token

      })
      
      history.push("/HomePage")
    } catch (err) {}
  }
  

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedUser && !error) {
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
      {!isLoading && loadedUser && (
        <form className="global-form" onSubmit={userUpdateSubmitHandler}>
          <Input
            id="email"
            type="email"
            element="input"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedUser.email}
            initialValid={true}
          />
          <Input
            id="firstname"
            type="text"
            element="input"
            label="First Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedUser.firstname}
            initialValid={true}
          />

          <Input
            id="lastname"
            type="text"
            element="input"
            label="Last Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedUser.lastname}
            initialValid={true}
          />
          <Input
            id="phonenumber"
            type="number"
            element="input"
            label="Phone Number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid data"
            onInput={inputHandler}
            initialValue={loadedUser.phonenumber}
            initialValid={true}
          />
          <Input
            id="bio"
            type="text"
            element="textarea"
            label="Bio"
            validators={[]}
            onInput={inputHandler}
            initialValue={loadedUser.bio ? loadedUser.bio : ""}
            initialValid={true}
          />
          <Input
            id="password"
            type="text, number"
            element="input"
            label="Password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter your password or a new password to confirm your change"
            initialValue={loadedUser.password}
            onInput={inputHandler}
            
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE USER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
