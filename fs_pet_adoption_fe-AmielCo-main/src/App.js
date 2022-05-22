import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
  Switch,
} from "react-router-dom";
import AdminPage from "./admin/pages/AdminPage";
import NewPet from "./pets/pages/NewPet";
import MainNavigation from "./shared/Navigation/MainNavigation";
import UserPets from "./pets/pages/UserPets";
import HomePage from "./homePage/HomePage";
import UpdateUser from "./user/pages/UpdateUser";
import UserHomePage from "./user/pages/UserHomePage";
import { AuthContext } from "./shared/context/auth-context";
import AllPets from "./pets/components/AllPets";
import UpdatePet from "./pets/pages/UpdatePet";

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState();
  const [firstname, setFirstname] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPets, setUserPets] = useState([]);

  const login = useCallback((uid, token, isAdmin, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setIsAdmin(isAdmin);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        isAdmin,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.isAdmin,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token && !isAdmin) {
    routes = (
      <Switch>
        <Route path="/user" exact>
          <UserHomePage />
        </Route>

        <Route path="/user/:userId" exact>
          <UpdateUser />
        </Route>
        <Route path="/pet/user/:userId" exact>
          <UserPets />
        </Route>

        <Route path="/search" exact>
          <AllPets />
        </Route>
        <Redirect to="/user" />
      </Switch>
    );
  } else if (isAdmin && token) {
    routes = (
      <Switch>
        <Route path="/pet/add" exact>
          <NewPet />
        </Route>
        <Route path="/admin" exact>
          <AdminPage />
        </Route>
        <Route path="/pet/user/:userId/" exact>
          <UserPets />
        </Route>
        <Route path="/pet/:pid">
          <UpdatePet />
        </Route>
        <Route path="/search" exact>
          <AllPets />
        </Route>
        <Redirect to="/admin" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/search" exact>
          <AllPets />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        isAdmin: isAdmin,
        isLoggedInAdmin: !!isAdmin,
        login: login,
        logout: logout,
        userId: userId,
        firstname: firstname,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
