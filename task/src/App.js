import logo from './logo.svg';
import './App.css';
import { Routes, Route, Router, Link, NavLink } from "react-router-dom";
import Navbar from './pages/components/navbar';
import Project from './pages/Project/ProjectAdd';
import User from './pages/User/UserAdd'
import RouteComp from './pages/components/Routercomponent';

function App() {
  return (
    // <div className="App">

    //   {/* <Navbar />
    //   <Project />
    //   <User /> */}
    // </div>
    <RouteComp />
    // <Router />
  );
}

export default App;
