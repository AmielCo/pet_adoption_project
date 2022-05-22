import React, { useState, useContext, useEffect } from "react";
import "./PetItem.css";
import "../../shared//FormElements/Select.css";
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import Modal from "../../shared/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";

const PetItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAdopted, setIsAdopted] = useState(false);
  const [isReturningMyPet, setIsReturningMyPet] = useState(false);

  const [seeMore, setSeeMore] = useState(false);
  const [isFostered, setIsFostered] = useState(false);
  const userId = auth.userId;
  const history = useHistory();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const seeMoreHandler = () => {
    setSeeMore((prevMode) => !prevMode);
  };

  const returnPetHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:8080/pet/${props.id}`
      );
      if (responseData.pet.owned.includes(userId)) {
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/users/${userId}/`
          );
          const userPetsArr = responseData.user.pets;
          if (
            userPetsArr.includes(props.id) &&
            (props.status === "adopted" || props.status === "fostered")
          ) {
            try {
              await sendRequest(
                `http://localhost:8080/pet/${userId}/return`,
                "DELETE",
                JSON.stringify({
                  _id: props.id,
                }),
                {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + auth.token,
                }
              );
              props.onAdopt(props.id);
            } catch (err) {}
            try {
              const responseData = await sendRequest(
                `http://localhost:8080/pet/${props.id}/update`,
                "PUT",
                JSON.stringify({
                  status: "adoptable",
                }),
                {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + auth.token,
                }
              );
              alert("Pet returned to adoptable status.");
              history.push("/");
            } catch (err) {}
          }
        } catch (err) {}
      } else {
        alert(
          "You do not own this pet. If you have saved it, you can remove it from your saved pets."
        );
      }
    } catch (err) {}
  };

  const adoptPetHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:8080/users/${userId}/`
      );
      const userPetsArr = responseData.user.pets;
      if (userPetsArr.includes(props.id) && props.status === "adoptable") {
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/pet/${props.id}/update`,
            "PUT",
            JSON.stringify({
              status: "adopted",
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
        } catch (err) {}
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/pet/${userId}/adopt`,
            "POST",
            JSON.stringify({
              _id: props.id,
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          props.onAdopt(responseData);
        } catch (err) {}
        alert("Pet adopted!");
        history.push("/user");
      } else if (
        !userPetsArr.includes(props.id) &&
        props.status === "adoptable"
      ) {
        savePetHandler(e);
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/pet/${userId}/adopt`,
            "POST",
            JSON.stringify({
              _id: props.id,
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          props.onAdopt(responseData);
        } catch (err) {}
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/pet/${props.id}/update`,
            "PUT",
            JSON.stringify({
              status: "adopted",
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          alert("Pet adopted!");
          history.push("/user");
        } catch (err) {}
      } else {
        alert("You can only adopt adoptable pets. Please try again.");
      }
    } catch (err) {}
  };

  const fosterPetHandler = async (e) => {
    e.preventDefault();
    if (props.status === "adoptable") {
      savePetHandler(e);

      try {
        const responseData = await sendRequest(
          `http://localhost:8080/pet/${userId}/adopt`,
          "POST",
          JSON.stringify({
            _id: props.id,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.onAdopt(responseData);
      } catch (err) {}
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/pet/${props.id}/update`,
          "PUT",
          JSON.stringify({
            status: "fostered",
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        alert("Pet has been fostered.");
        history.push("/user");
      } catch (err) {}
    } else {
      alert("You can only foster adoptable pets. Please try again.");
    }
  };

  const savePetHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:8080/users/${userId}/`
      );
      const userPetsArr = responseData.user.pets;
      if (userPetsArr.includes(props.id)) {
        alert("Pet already saved!");
      } else if (props.status === "adoptable" || props.status === "fostered") {
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/pet/${userId}/save`,
            "POST",
            JSON.stringify({
              _id: props.id,
              userId: userId,
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          props.onSave(responseData.pet);
        } catch (err) {}
        alert("Pet saved!");
        history.push(`/pet/user/${userId}`);
      } else {
        alert("You can only save adoptable pets. Please try again.");
      }
    } catch (err) {}
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      const responseData = await sendRequest(
        `http://localhost:8080/pet/${props.id}`
      );
      if (!responseData.pet.owned.includes(userId)) {
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/users/${userId}/`
          );
          const userPetsArr = responseData.user.pets;
          if (
            userPetsArr.includes(
              props.id
            ) /* && props.status !== "adopted" && props.status !== "fostered" */
          ) {
            try {
              await sendRequest(
                `http://localhost:8080/pet/${userId}/save`,
                "DELETE",
                JSON.stringify({
                  _id: props.id,
                }),
                {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + auth.token,
                }
              );
              props.onDelete(props.id);
            } catch (err) {}
          }
          alert("Pet has been removed!");
          history.push("/");
        } catch (err) {}
      } else {
        alert(
          "You can't remove a pet you own from your pets. Please Return it instead"
        );
      }
    } catch (err) {}
  };
  useEffect(() => {
    const configBtn = async () => {
      if (auth.token) {
        try {
          const responseData = await sendRequest(
            `http://localhost:8080/users/${userId}/`
          );
          const userPetsArr = responseData.user.pets;
          if (
            userPetsArr.includes(
              props.id
            ) /*  && (props.status === "adoptable" || props.status === "fostered")  */
          ) {
            setIsSaved(true);
          }
          if (
            (userPetsArr.includes(props.id) && props.status === "adopted") ||
            props.status === "adopted"
          ) {
            setIsAdopted(true);
          }
          if (
            (userPetsArr.includes(props.id) && props.status === "fostered") ||
            props.status === "fostered"
          ) {
            setIsFostered(true);
          }
        } catch (err) {}
        if (props.status === "adopted" || props.status === "fostered") {
          try {
            const responseData = await sendRequest(
              `http://localhost:8080/pet/${props.id}`
            );
            if (responseData.pet.owned.includes(userId)) {
              setIsReturningMyPet(true);
            }
          } catch (err) {}
        }
      }
    };
    configBtn();
  }, [sendRequest, userId, auth.token, props.id, props.status]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="pet-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and remove this pet from your pets?</p>
      </Modal>
      <div className="container">
        <li className="pet-item">
          <Card className="pet-item__content">
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="pet-item__image">
              <img src={props.image} alt={props.name} />
            </div>
            <div className="pet-item__info">
              <h2>Name</h2>
              <h3>{props.name}</h3>
              <h2>Type</h2>
              <h3>{props.type}</h3>
              <h2>Status</h2>
              <h3>{props.status}</h3>
              <h2>Breed</h2>
              <h3>{props.breed}</h3>
              {seeMore && (
                <div>
                  <h2>Bio</h2>
                  <h3>{props.bio}</h3>
                  <h2>Color</h2>
                  <h3>{props.color}</h3>
                  <h2>Height</h2>
                  <h3>{props.height}</h3>
                  <h2>Weight</h2>
                  <h3>{props.weight}</h3>
                  <h2>Hypoallergenic</h2>
                  <h3>{props.hypoallergenic}</h3>
                  <h2>Dietary Restrictions</h2>
                  <h3>{props.dietary}</h3>
                  {auth.isLoggedIn && auth.isAdmin && (
                    <div>
                      <p>
                        <u>
                          <b>ID</b>
                        </u>
                      </p>
                      <p>{props.id}</p>
                      <u>
                        <b>Owned by</b>
                      </u>
                      <p>{props.owned}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pet-item__actions">
              <Button inverse onClick={seeMoreHandler}>
                {!seeMore ? "See More" : "See Less"}
              </Button>
              {auth.isLoggedIn && !auth.isAdmin && !isSaved && !isAdopted && (
                <Button type="button" inverse onClick={savePetHandler}>
                  SAVE PET
                </Button>
              )}
              {auth.isLoggedIn && auth.isAdmin && (
                <Button to={`/pet/${props.id}`}>EDIT</Button>
              )}
              {auth.isLoggedIn &&
                !auth.isAdmin &&
                isSaved &&
                !isReturningMyPet && (
                  <Button danger onClick={showDeleteWarningHandler}>
                    REMOVE FROM MY PET
                  </Button>
                )}
              {auth.isLoggedIn && !auth.isAdmin && !isAdopted && !isFostered && (
                <Button type="button" onClick={adoptPetHandler}>
                  ADOPT ME
                </Button>
              )}
              {auth.isLoggedIn && !auth.isAdmin && !isAdopted && !isFostered && (
                <Button type="button" onClick={fosterPetHandler}>
                  FOSTER ME
                </Button>
              )}
              {auth.isLoggedIn && !auth.isAdmin && isReturningMyPet && (
                <Button type="button" danger onClick={returnPetHandler}>
                  RETURN PET
                </Button>
              )}
            </div>
          </Card>
        </li>
      </div>
    </React.Fragment>
  );
};

export default PetItem;
