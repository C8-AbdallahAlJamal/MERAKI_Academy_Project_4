import React, { useContext, useEffect } from 'react'
import "./MyProfile.css";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';

import { AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { Avatar } from '@mui/material';

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
    const [comment, setComment] = useState("");

    const [isClicked, setIsClicked] = useState("");

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
            setMyPosts(myPosts.map((element) => {
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
                setMyPosts(myPosts.map((element) => {
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

    return (
        localStorage.getItem("Token") ?
            <div id="my-profile-page">
                <Navigation />
                <div id="profile-picture-div">
                    <Avatar id="my-profile-picture" src={ user.URL } />
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
                        <div id="add-post">
                            <Avatar className="new-post-personal-picture" src={ user.URL }/>
                            <textarea id="new-post-textarea" placeholder="What's on your mind?" onChange={ postContentHandle }></textarea>
                            <button onClick={ postHandle }>Post</button>
                        </div>
                        <div id="my-posts">
                            { myPosts && myPosts.map((element) => {
                                return (
                                    <div key={ element._id } className='posts'>
                                        <div id="my-post-author-info">
                                            <Avatar className="new-post-personal-picture" src={ user.URL }/>
                                            <h6 className='post-author'>{ name }</h6>
                                        </div>
                                        <div id="post-content">
                                            <p>{ element.description }</p>
                                            <img  className="post-image" src={ element.picture } />
                                        </div>
                                        <div id="like-and-comment">
                                            <AiFillLike onClick={ () => { (Like(element._id)) } } />
                                            <span>{ element.numberOfLikes }Likes</span>
                                            {
                                                isClicked === element._id ?
                                                    <div>
                                                        <FaRegCommentAlt onClick={ () => { setIsClicked("") } } />
                                                        <span>{ element.numberOfLikes } Comments</span>
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
                                                            <input onChange={ (event) => { setComment(event.target.value) } } />
                                                            <button name={ element._id } onClick={ addComment }>Comment</button>
                                                        </div>
                                                        { element.comments.map((elem) => {
                                                            return (
                                                                <div key={ elem._id }>
                                                                    <Avatar className='new-post-personal-picture' src={ elem.commenter.picture } />
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

export default MyProfile