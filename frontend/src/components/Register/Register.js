import React, {useRef} from 'react'
import "./Register.css"
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [passError, setPassError] = useState(null);
    const [message, setMessage] = useState("");

    const [picture, setPicture] = useState("");
    const [url, setUrl] = useState("");

    const [country, setCountry] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [DOB, setDOB] = useState("");
    const imageInputRef = useRef(null);


    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (passowrd) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    }

    const clickInput = () => {
        imageInputRef.current.click();
    }

    const addPicture = (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "profilePicture");
        data.append("cloud_name", "dbkfrtdjm");
        fetch("https://api.cloudinary.com/v1_1/dbkfrtdjm/image/upload", { method: "post", body: data }).then(resp => resp.json()).then(data => {
            setUrl(data.url)
        }).catch(err => console.log(err));
    }

    const registerHandle = async (event) => {
        if (buttonHandleBoolean()) {
            setMessage("An Error Occurred")
        } else {
            setMessage("");
            try {
                const registerObj = { firstName, lastName, email, password, picture: url, country, location, bio, DOB};
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
                <input type='file' ref={ imageInputRef } hidden onChange={(event)=>{addPicture(event.target.files[0])}}/>
                <Avatar onClick={ clickInput } src={ url } />
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