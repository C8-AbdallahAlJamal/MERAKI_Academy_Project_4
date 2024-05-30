import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import "./Home.css";
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';

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
            const result = await axios.post("https://connect-hub-88o5.onrender.com/"+"/user/Login", loginObj);
            if (!result.data.success) {
                setMessage(result.data.message);
            } else {
                localStorage.setItem("Token", result.data.token);
                user.setToken(result.data.token);
                localStorage.setItem("userId", result.data.userId);
                navigate("/Dashboard")
            }
        } else {
            setMessage("Please Enter Valid Inputs");
        }
    }

    useEffect(() => {
        if (localStorage.getItem("Token")) {
            navigate("/Dashboard");
        } else {
            navigate("/")
        }
    }, [user.token]);

    const signUpHandle = () => {
        navigate("/Register")
    }

    const handleEnterButton = (event) => {
        if (event.key === "Enter") {
            loginHandle();
        }
    }
    return (
        <div id="container">
            <div className="home-page">
                    <div id="email-and-password-inputs">
                        <h1 id="login">LOGIN</h1>
                        <div id="email-and-error-message">
                            <input className='email-and-password-boxes' id="email-input" type="email" placeholder="Email Address" value={ email } onChange={ (event) => {
                                if (!isValidEmail(event.target.value)) {
                                    setError("Email is invalid");
                                } else {
                                    setError(null);
                                }
                                setEmail(event.target.value);
                            } } onKeyDown={ handleEnterButton }></input>
                            { error && email !== "" && <h5 className="error-message">{ error }</h5> }
                        </div>

                        <div id="password-and-message">
                            <input id="password-input" className='email-and-password-boxes' type="password" placeholder="Password" onChange={ (event) => {
                                setPassword(event.target.value);
                            } } onKeyDown={ handleEnterButton }></input>
                        </div>
                        <div id="login-button-and-message">
                            <button id="login-button" style={ { cursor: "pointer" } } onClick={ loginHandle }>Login</button>
                            { message ? <h5 className="error-message">{ message }</h5> : "" }
                        </div>

                    </div>
                <div id="sign-up-container">
                    <button id="sign-up-button" style={ { cursor: "pointer" } } onClick={ signUpHandle }>Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default Home