import React from "react";

import "./UsersList.css";
import Card from "../../shared/UIElements/Card"
import UsertItem from "./UserItem";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UsertItem
            key={user.id}
            id={user.id}
            image={user.image}
            firstname={user.firstname}
            lastname={user.lastname}
            email={user.email}
            phone={user.phonenumber}
            petCount={user.pets.length}
            pets={user.pets}
            
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
