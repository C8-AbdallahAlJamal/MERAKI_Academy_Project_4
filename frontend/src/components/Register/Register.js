import React from 'react'
import "./Register.css"
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [passError, setPassError] = useState(null);
    const [message, setMessage] = useState("");
    const [picture] = useState("");
    const [country, setCountry] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [DOB, setDOB] = useState("");

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (passowrd) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    }

    const addPicture = (event) => {
        console.log(event.target.value)
    }

    const registerHandle = async (event) => {
        if (buttonHandleBoolean()) {
            setMessage("An Error Occurred")
        } else {
            setMessage("");
            try {
                const registerObj = { firstName, lastName, email, password, picture, country, location, bio, DOB};
                const result = await axios.post("http://localhost:5000/user/Register", registerObj);
                setMessage(result.data.message);
                if (result.data.success) {
                    setTimeout(() => {
                        setMessage("");
                        navigate("/");
                    }, 2000)
                }
            } catch (error) {
                console.log(error.message)
            }


        }
    }

    useEffect(() => {
        passwordHandle({ target: { value: password } });
    }, [password, passError])

    const passwordHandle = (event) => {
        if (!isValidPassword(event.target.value)) {
            setPassError("Invalid Password");
        } else {
            setPassError(null);
        }
        setPassword(event.target.value);
    }

    const buttonHandleBoolean = () => {
        return email === "" || error || firstName === "" || lastName === "" || password === "" || passError;
    }

    return (
        <div id="container">
            <div id="register-page">

                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" onClick={ addPicture }>
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
                <input type="text" placeholder='First Name' onChange={ (event) => {
                    setFirstName(event.target.value);
                } }></input>

                <input type="text" placeholder='Last Name' onChange={ (event) => {
                    setLastName(event.target.value);
                } }></input>

                <input type="text" placeholder='Country' onChange={ (event) => {
                    setLocation(event.target.value);
                } } />

                <input type="text" placeholder='Bio' onChange={ (event) => {
                    setBio(event.target.value);
                } } />
                
                <input type="date" placeholder='DOB' onChange={ (event) => {
                    setDOB(event.target.value);
                } } />

                <input type="text" placeholder='Location' onChange={ (event) => {
                    setCountry(event.target.value);
                } } />

                <input type="email" placeholder='Email Address' onChange={ (event) => {
                    if (!isValidEmail(event.target.value)) {
                        setError("Invalid Email");
                    } else {
                        setError(null);
                    }
                    setEmail(event.target.value);
                } }></input>
                { error && email !== "" && <h5>{ error }</h5> }

                <input type="password" placeholder='Password' onChange={ passwordHandle }></input>

                { passError && password !== "" && <h5>{ passError }</h5> }

                <button disabled={ buttonHandleBoolean() } onClick={ registerHandle }>Register</button>
                { message }
            </div>
        </div>
    )
}

export default Register