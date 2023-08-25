import "./App.css";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import React, {useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
export const UserContext = createContext();


const App = () => {
    const [token, setToken] = useState(localStorage.getItem("Token"));

    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate("/Dashboard");
        } else {
            navigate("/")
        }
    }, [token]);
    return (
        <div id="app">
            <UserContext.Provider value={ { token, setUserId, userId, setToken } }>
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
