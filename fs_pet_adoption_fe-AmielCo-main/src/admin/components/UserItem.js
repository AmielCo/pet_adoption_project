import React from "react";
import { Link } from "react-router-dom";
import "./UserItem.css";
import Avatar from "../../shared/UIElements/Avatar";
import Card from "../../shared/UIElements/Card";

const UsertItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`pet/user/${props.id}`}>
          <div className="user-item__image"></div>
          <div className="user-item__info">
            <h3>Name</h3>
            <h2>
              {props.firstname} {props.lastname}
            </h2>
            <h3>Email</h3>
            <h2>{props.email}</h2>
            <h3>Phone</h3>
            <h2>{props.phone}</h2>
            <h3>Pet Count</h3>
            <h2>
              {props.petCount} {props.petCount === 1 ? "Pet" : "Pets"}
            </h2>
            <h3>
              
                Click to see <em>{props.firstname}'s</em> pets{" "}
              
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UsertItem;
