import React, { useContext, useEffect } from 'react'
import "./MyProfile.css";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';

import { AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";

const MyProfile = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [name, setName] = useState("User");
    const [numOfFriends, setNumOfFriends] = useState("NaN");
    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [location, setLocation] = useState("");
    const [DOB, setDOB] = useState("");
    const [postContent, setPostContent] = useState("");
    const [myPosts, setMyPosts] = useState("");

    useEffect(() => {
        if (localStorage.getItem("Token")) {
            getUserInfo();
            getMyPosts();
        } else {
            navigate("/");
        }
    }, [])

    const getUserInfo = async () => {
        try {
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
        } catch (error) {
            console.log(error.message);
        }
    }

    const postContentHandle = (event) => {
        setPostContent(event.target.value);
    }

    const postHandle = async () => {
        if (localStorage.getItem("Token")) {
            if (postContent !== "") {
                try {
                    const result = await axios.post("http://localhost:5000/post/", { description: postContent, picture: "" }, { headers: { Authorization: `Bearer ${user.token}` } });
                    setMyPosts([result.data.post, ...myPosts]);
                } catch (error) {
                    console.log(error.message);
                }
            }

        } else {
            navigate("/");
        }
    }

    const getMyPosts = async () => {
        try {
            const result = await axios.get("http://localhost:5000/post/myposts", { headers: { Authorization: `Bearer ${user.token}` } });
            result.data.posts.reverse();
            setMyPosts(result.data.posts);

        } catch (error) {
            console.log(error.message)
        }
    }

    const Like = async (postId) => {
        try {
            const result = await axios.put(`http://localhost:5000/post/${postId}/like`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            
        } catch (error) {
            console.log(error.message)
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
                        <div id="add-post">
                            <img className="new-post-personal-picture" src={ user.URL }></img>
                            <textarea id="new-post-textarea" placeholder="What's on your mind?" onChange={ postContentHandle }></textarea>
                            <button onClick={ postHandle }>Post</button>
                        </div>
                        <div id="my-posts">
                            { myPosts && myPosts.map((element) => {
                                return (
                                    <div key={ element._id } className='posts'>
                                        <div id="my-post-author-info">
                                            <img className="new-post-personal-picture" src={ user.URL }></img>
                                            <h6 className='post-author'>{ name }</h6>
                                        </div>
                                        <div id = "post-content">
                                            <p>{ element.description }</p>
                                            <img className="post-image" src={ element.picture } />
                                        </div>
                                        <div id="like-and-comment">
                                            <AiFillLike onClick={()=>{(Like(element._id))}}/>
                                            <span>{ element.numberOfLikes }Likes</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                                                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                                            </svg>

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

export default MyProfile