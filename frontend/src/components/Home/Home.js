import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import "./Home.css";
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import Dashboard from '../Dashboard/Dashboard';

const Home = () => {
    const user = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }
    const loginHandle = async (event) => {
        if (!error && email !== "" && password !== "") {
            setMessage("");
            const loginObj = { email, password };
            const result = await axios.post("http://localhost:5000/user/Login", loginObj);
            if (!result.data.success) {
                setMessage(result.data.message);
            } else {
                localStorage.setItem("Token", result.data.token);
                navigate("/Dashboard")
            }
        } else {
            setMessage("Please Enter Valid Inputs");
        }
    }
    console.log(user.token);
    return (
        <div id="container">
            {
                user.token ?
                    navigate("/Dashboard")
                    :
                    <div className="home-page">
                        <input type="email" placeholder="Email Address" value={ email } onChange={ (event) => {
                            if (!isValidEmail(event.target.value)) {
                                setError("Email is invalid");
                            } else {
                                setError(null);
                            }
                            setEmail(event.target.value);
                        } }></input>
                        { error && email !== "" && <h5>{ error }</h5> }
                        <input type="password" placeholder="Password" onChange={ (event) => {
                            setPassword(event.target.value);
                        } }></input>
                        { message }

                        <button onClick={ loginHandle }>Login</button>
                        <Link to="/Register"><button>Sign Up</button></Link>
                    </div>
            }

        </div>
    )
}

export default Home