import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook"
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import "./AdminPage.css"

const AdminPage = () => {
 const {isLoading, error, sendRequest, clearError} =useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest("http://localhost:8080/users");
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

 

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Card>
        <h2>App Users</h2>
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </Card>
      <Card className="admin-options">
        <Button to="/pet/add">Add Pet</Button>
        <Button to="/search">View Pets</Button>
      </Card>
    </React.Fragment>
  );
};

export default AdminPage;
