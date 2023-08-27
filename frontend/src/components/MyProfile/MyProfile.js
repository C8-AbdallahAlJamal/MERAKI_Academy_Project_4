import React, { useContext, useEffect } from 'react'
import "./MyProfile.css";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';
const MyProfile = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [name, setName] = useState("User");
    const [numOfFriends, setNumOfFriends] = useState("NaN");
    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [location, setLocation] = useState("");
    const [DOB, setDOB] = useState("");
    useEffect(() => {
        if (localStorage.getItem("Token")) {
            getUserInfo();
        } else {
            navigate("/");
        }
    }, [])

    const getUserInfo = async () => {
        const result = await axios.get(`http://localhost:5000/user/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
        if (result.data.success) {
            setName(result.data.userInfo.firstName + " " + result.data.userInfo.lastName);
            setNumOfFriends(result.data.userInfo.friends.length);
            setBio(result.data.userInfo.bio);
            setCountry(result.data.userInfo.country);
            setLocation(result.data.userInfo.location);
            setDOB(result.data.userInfo.DOB.split("T")[0]);
        } else {
            navigate("/");
        }

    }

    return (
        localStorage.getItem("Token") ?
            <div id="my-profile-page">
                <Navigation />
                <div id="profile-picture-div">
                    <img id="my-profile-picture" src={ user.URL } />
                    <h2 id="name">{ name }</h2>
                    <span>{ numOfFriends } Friends</span>
                </div>

                <div id="columns">
                    <div id="personal-info">
                        <div id="bio" className='width'>
                            <h3 className='heads'>Bio</h3>
                            { bio }
                        </div>
                        <div id="country" className='width'>
                            <h3 className='heads'>Country</h3>
                            {country}
                        </div>
                        <div id="location" className='width'>
                            <h3 className='heads'>Lives in</h3>
                            { location }
                        </div>
                        <div id="DOB" className='width'>
                            <h3 className='heads'>Date of Birth</h3>
                            { DOB }
                        </div>
                    </div>
                    <div id="posts">
                        <div>
                            
                        </div>
                    </div>

                </div>
            </div>
            :
            navigate("/")
    )
}

export default MyProfile