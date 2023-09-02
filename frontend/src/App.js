import "./App.css";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import MyProfile from "./components/MyProfile/MyProfile";
import Profile from "./components/Profile/Profile";
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const App = () => {
    

    const [token, setToken] = useState(localStorage.getItem("Token"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [URL, setURL] = useState("");
    const [myInfo, setMyInfo] = useState();
    const [friends, setFriends] = useState([])
    useEffect(() => {
        if (token) {
            getMyInfo();
        }
    }, [token]);

    const getMyInfo = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/user/${localStorage.getItem("userId")}`, { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } });
            setMyInfo(result.data.userInfo);
            setFriends(result.data.userInfo.friends);
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div id="app">
            <UserContext.Provider value={ { token, setUserId, userId, setToken, URL, setURL, setMyInfo, myInfo, friends, setFriends } }>
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/Register" element={ <Register /> } />
                    <Route path="/Dashboard" element={ <Dashboard /> } />
                    <Route path="/profile/:userId" element={ <Profile /> } />
                    <Route path="*" element={ <h1>404 NOT FOUND</h1> } />
                    <Route path="/MyProfile" element={ <MyProfile /> } />
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
