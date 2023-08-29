import React from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navigation from '../Navigation/Navigation';
import "./Profile.css"
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useState } from 'react';
import { useId } from 'react';
const Profile = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const { userId } = useParams();
    const [name, setName] = useState("User");
    const [numOfFriends, setNumOfFriends] = useState("");
    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [location, setLocation] = useState("");
    const [DOB, setDOB] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [myPosts, setMyPosts] = useState("");

    useEffect(() => {
        if (localStorage.getItem("Token")) {
            getUserInfo();
            getUserPosts();

        } else {
            navigate("/");
        }
    }, [userId]);

    const getUserInfo = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/user/profile/${userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            if (result.data.success) {
                setName(result.data.result.firstName + " " + result.data.result.lastName);
                setNumOfFriends(result.data.result.friends.length);
                setBio(result.data.result.bio);
                setCountry(result.data.result.country);
                setLocation(result.data.result.location);
                setDOB(result.data.result.DOB.split("T")[0]);
                setProfilePicture(result.data.result.picture);
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getUserPosts = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/post/${userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            if (result.data.success) {
                result.data.posts.reverse();
                setMyPosts(result.data.posts);
            } else {
                setMyPosts("");
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        localStorage.getItem("Token") ?
            <div id="my-profile-page">
                <Navigation />
                <div id="profile-picture-div">
                    <img id="my-profile-picture" src={ profilePicture } />
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
                            { country }
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

                    <div id="posts-column">
                        <div id="my-posts">
                            { myPosts && myPosts.map((element) => {
                                return (
                                    <div key={ element._id } className='posts'>
                                        <div id="my-post-author-info">
                                            <img className="new-post-personal-picture" src={ profilePicture }></img>
                                            <h6 className='post-author'>{ name }</h6>
                                        </div>
                                        <div>
                                            <p>{ element.description }</p>
                                            <img className="post-image" src={ element.picture } />
                                        </div>

                                    </div>
                                )
                            }) }
                        </div>
                    </div>
                </div>
            </div>
            :
            navigate("/")
    )
}

export default Profile