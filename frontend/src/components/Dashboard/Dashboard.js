import React from 'react'
import Navigation from '../Navigation/Navigation'
import { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
const Dashboard = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    return (
        localStorage.getItem("Token") ?
            <div id="dashboard">
             <Navigation />
            </div>
            :
            navigate("/")
    )
}

export default Dashboard