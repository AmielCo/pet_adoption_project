import React, { useState } from "react";
import Button from "../shared/FormElements/Button";
import Modal from "../shared/UIElements/Modal";
import Input from "../shared/FormElements/Input";
import Card from "../shared/UIElements/Card";
import Auth from "../user/components/Auth";
import "../user/components/Auth.css";
import { NavLink } from "react-router-dom";

const HomePage = (props) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { authSubmitHandler } = props;

  const openModalHandler = () => {
    setShowAuthModal(true);
  };
  const closeModalHandler = () => {
    setShowAuthModal(false);
  };

  return (
    <React.Fragment>
      <Card className="authentication__modal-container welcome__img">
        <Card>
          <Modal
            className="authentication__modal"
            show={showAuthModal}
            onCancel={closeModalHandler}
            header="Authentication"
            contentClass="user-item__modal-content"
            footerClass="user-item__modal-actions"
            footer={
              <Button inverse onClick={closeModalHandler}>
                CANCEL
              </Button>
            }
            // a changer
          >
            {
              <React.Fragment>
                <div>
                  <Auth closeModalHandler={closeModalHandler} />
                </div>
              </React.Fragment>
            }
          </Modal>
          <div>
            <h1>Welcome to the Pet Adoption Website</h1>

            <Button to="/search">Begin your search</Button>
            <Button onClick={openModalHandler}>Authenticate</Button>
          </div>
        </Card>
      </Card>
      <Card className="welcome__explanations">
        <Card>
          <h2>Who are we?</h2>
          <p> Welcome to the PetFinder website. </p>
          <p> This website is a place where you can find and adopt a pet. </p>
          <p>
            {" "}
            You can search for any of our pets without registering. However any
            other action will require a full authentication process{" "}
          </p>
          <p> Our wonderful pets are waiting for you! </p>
        </Card>
      </Card>
    </React.Fragment>
  );
};

export default HomePage;
