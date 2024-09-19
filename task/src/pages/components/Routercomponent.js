import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import User from "../User/UserAdd";
import Project from "../Project/ProjectAdd";
import Archive from "../Archive/archive";
import LoginPage from "../Loginpage";
import { createContext } from "react";
import { useState } from "react";
import Group from "../Group/groupCreate";
import Task from "../Tasks/TaskAdd";


export default function RouteComp() {

    return (

        <Router>
            <Routes>
            <Route path="/" element={<LoginPage />} />
                {/* <Route path="/" element={<User />} /> */}
                <Route
                    path="/user"
                    element={<User />} />
                <Route
                    path="/project"
                    element={<Project />}
                />
                <Route
                    path="/task"
                    element={<Task />}
                />
                <Route
                    path="/archive"
                    element={<Archive />}
                />
                 <Route
                    path="/group"
                    element={<Group />}
                />

            </Routes>
        </Router>

    );
}
