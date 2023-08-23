import "./App.css";
import Register from "./components/Register/Register";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { createContext, useState } from "react";
export const UserContext = createContext();


const App = () => {
    const [token, setToken] = useState(localStorage.getItem("Token"));
    return (
        <div id = "body">
            <UserContext.Provider value={ {token} }>
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/Register" element={ <Register /> } />
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
