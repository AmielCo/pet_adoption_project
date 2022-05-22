import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import { AuthContext } from "../context/auth-context";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      
          {/* <li>
            <NavLink to="/admin" exact>
              Admin Page
            </NavLink>
          </li> */}
        

      {auth.isLoggedIn && !auth.isAdmin &&(
        <li>
          <NavLink to={`/pet/user/${auth.userId}`}>My Pets</NavLink>
        </li>
      )}

      {/* {!auth.isLoggedIn && (
        <li>
          <NavLink to="/pet/add">Add pets</NavLink>
        </li>
      )} */}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Home Page</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/user" exact>
            Home Page
          </NavLink>
        </li>
      )}
      {/* {!auth.isLoggedIn && (
        <li>
          <NavLink to="/pets">See All Our Pets</NavLink>
        </li>
      )} */}
      <li>
        <NavLink to="/search">Search</NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
