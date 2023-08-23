import React from 'react'
import { Link } from "react-router-dom"
import "./Home.css";
import { useState } from 'react';

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }
    const loginHandle = (event) => {

    }
    return (
        <div id="container">
            <div className="home-page">
                <input type="email" placeholder="Email Address" value={ email } onChange={ (event) => {
                    if (!isValidEmail(event.target.value)) {
                        setError("Email is invalid");
                    } else {
                        setError(null);
                    }
                    setEmail(event.target.value);
                } }></input>
                { error && <h2>{ error }</h2>}
                <input type="password" placeholder="Password" onChange={ (event) => {
                    setPassword(event.target.value);
                } }></input>

                <button onClick={ loginHandle }>Login</button>

                <Link to="/Register"><button>Sign Up</button></Link>
            </div>
        </div>
    )
}

export default Home