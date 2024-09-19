import React from "react";
import {
  Routes,
  Route,
  Router,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import User from "../User/UserAdd";
import Project from "../Project/ProjectAdd";

export default function Navbar() {
  let navigate = useNavigate();

  const LogOut = () => {
    console.log("lll");
    // navigate("/")
  let userData = JSON.parse(localStorage["userData"]);
  console.log(userData);
  
    Axios.get(process.env.REACT_APP_API_BASE_URL + "/users/logout", {
      headers: {
        auth_token: userData.session_token,
      },
    })
      .then((response) => {
        console.log(userData);
        localStorage.removeItem('userData');
        // localStorage.clear();
        navigate("/");
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to={"/user"}>
                User
              </NavLink>
            </li>
            <li className="nav-item">
              <Link to={"/project"} className="nav-link">
                Project
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/task"} className="nav-link">
                Task
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/archive"} className="nav-link">
                Archive
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/group"} className="nav-link">
                Group
              </Link>
            </li>
            {/* <li className="nav-item" style={{float:"right"}}>
              <ReactSearchBox
                placeholder="Search"
                // value="Doe"
                // data={this.data}
                callback={(record) => console.log(record)}
              />
            </li> */}
          </ul>

         
        </div>
        <button className="button" onClick={() => LogOut()}>
            Logout
          </button>
      </nav>
    </div>
  );
}
