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
import { AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { Avatar } from '@mui/material';

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
    const [posts, setPosts] = useState("");
    const [isClicked, setIsClicked] = useState("");
    const [comment, setComment] = useState("");

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
                setPosts(result.data.posts);
            } else {
                setPosts("");
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    const Like = async (postId) => {
        try {
            const result = await axios.put(`http://localhost:5000/post/${postId}/like`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            setPosts(posts.map((element) => {
                if (result.data.post._id === element._id) {
                    element.numberOfLikes++;
                }
                return element;
            }));

        } catch (error) {
            console.log(error.message)
        }
    }

    const addComment = async (event) => {
        const description = comment;
        if (comment != "") {
            try {
                const result = await axios.post(`http://localhost:5000/post/${event.target.name}/comment`, { description }, { headers: { Authorization: `Bearer ${user.token}` } });
                setPosts(posts.map((element) => {
                    if (result.data.result._id === element._id) {
                        element.comments.push(result.data.comment);
                    }
                    return element;
                }))
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const goToUserProfile = (profileId) => {
        if (localStorage.getItem("Token")) {
            navigate(`/profile/${profileId}`);
        } else {
            navigate("/");
        }
    }

    return (
        localStorage.getItem("Token") ?
            <div id="my-profile-page">
                <Navigation />
                <div id="profile-picture-div">
                    <Avatar id="my-profile-picture" src={ profilePicture } />
                    <h2 id="name">{ name }</h2>
                    <span>{ numOfFriends } Following</span>
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
                            { posts && posts.map((element) => {
                                return (
                                    <div key={ element._id } className='posts'>
                                        <div id="my-post-author-info">
                                            <Avatar className="new-post-personal-picture" src={ profilePicture }/>
                                            <h6 className='post-author'>{ name }</h6>
                                        </div>
                                        <div id="post-content">
                                            <p>{ element.description }</p>
                                            <img className="post-image" src={ element.picture } />
                                        </div>
                                        <div id="like-and-comment">
                                            <AiFillLike onClick={ () => { (Like(element._id)) } } />
                                            <span>{ element.numberOfLikes }Likes</span>
                                            {
                                                isClicked === element._id ?
                                                    <div>
                                                        <FaRegCommentAlt onClick={ () => { setIsClicked("") } } />
                                                        <span>{ element.comments.length } Comments</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <FaRegCommentAlt onClick={ () => { setIsClicked(element._id) } } />
                                                        <span>{ element.comments.length } Comments</span>
                                                    </div>
                                            }
                                        </div>
                                        <div id="comment-section">
                                            {
                                                isClicked === element._id ?
                                                    <div id="comments">
                                                        <div id="new-comment">
                                                            <input placeholder="Add Comment" onChange={ (event) => { setComment(event.target.value) } } />
                                                            <button name={ element._id } onClick={ addComment }>Comment</button>
                                                        </div>
                                                        { element.comments.map((elem) => {
                                                            return (
                                                                <div key={ elem._id }>
                                                                    <Avatar onClick={ () => { goToUserProfile(elem.commenter._id) } } className='new-post-personal-picture' src={ elem.commenter.picture } />
                                                                    <h6 >{ elem.commenter.firstName + " " + elem.commenter.lastName }</h6>
                                                                    <h5>{ elem.description }</h5>
                                                                </div>
                                                            )
                                                        }) }
                                                    </div>
                                                    :
                                                    ""
                                            }
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