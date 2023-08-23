import React from 'react'
import "./Register.css"
import { useState } from 'react'
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { toBeEnabled } from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
const Register = () => {
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [passError, setPassError] = useState(null);

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (passowrd) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    }

    const addPicture = () => {
        console.log("asf")
    }

    const registerHandle = (event) => {
        if (!error) {

        } else {

        }
    }

    useEffect(() => {
        passwordHandle({target: {value: password}});
    }, [password, passError])

    const passwordHandle = (event) => {
        if (!isValidPassword(event.target.value)) {
            setPassError("Invalid Password");
        } else {
            setPassError(null);
        }
        setPassword(event.target.value);
    }

    return (
        <div id="container">
            <div id="register-page">

                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" onClick={ addPicture }>
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>

                <input type="text" placeholder='First Name' onChange={ (event) => {
                    setFName(event.target.value);
                } }></input>

                <input type="text" placeholder='Last Name' onChange={ (event) => {
                    setLName(event.target.value);
                } }></input>

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

                <button disabled={ email === "" || error || fName === "" || lName === "" || password === "" || passError } onClick={ registerHandle }>Register</button>
            </div>
        </div>
    )
}

export default Register