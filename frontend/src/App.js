import "./App.css";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
export const UserContext = createContext();


const App = () => {
    const [token, setToken] = useState(localStorage.getItem("Token"));
    return (
        <div id="body">
            <UserContext.Provider value={ { token } }>
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/Register" element={ <Register /> } />
                    <Route path="/Dashboard" element={ <Dashboard /> } />
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
