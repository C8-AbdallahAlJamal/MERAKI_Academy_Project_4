import React, { useContext, useEffect, useRef } from 'react'
import "./MyProfile.css";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';
import { FaWindowClose } from "react-icons/fa";
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
    const imageInputRef = useRef(null);
    const [isClicked, setIsClicked] = useState("");
    const [picture, setPicture] = useState("");

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
            const result = await axios.get(`https://connect-hub-88o5.onrender.com/user/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            if (result.data.success) {
                setName(result.data.userInfo.firstName + " " + result.data.userInfo.lastName);
                setNumOfFriends(result.data.userInfo.friends.length);
                setBio(result.data.userInfo.bio);
                setCountry(result.data.userInfo.country);
                setLocation(result.data.userInfo.location);
                if (result.data.userInfo.DOB) {
                    setDOB(result.data.userInfo.DOB.split("T")[0]);
                }
                setPicture(result.data.userInfo.picture);
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
                    const result = await axios.post("https://connect-hub-88o5.onrender.com/post/", { description: postContent, picture: "" }, { headers: { Authorization: `Bearer ${user.token}` } });
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
            const result = await axios.get("https://connect-hub-88o5.onrender.com/post/myposts", { headers: { Authorization: `Bearer ${user.token}` } });
            result.data.posts.reverse();
            setMyPosts(result.data.posts);

        } catch (error) {
            console.log(error.message)
        }
    }

    const Like = async (postId) => {
        try {
            const result = await axios.put(`https://connect-hub-88o5.onrender.com/post/${postId}/like`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
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
                const result = await axios.post(`https://connect-hub-88o5.onrender.com/post/${event.target.name}/comment`, { description }, { headers: { Authorization: `Bearer ${user.token}` } });
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

    const clickInput = () => {
        imageInputRef.current.click();
    }

    const addPicture = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "profilePicture");
        data.append("cloud_name", "dbkfrtdjm");
        fetch("https://api.cloudinary.com/v1_1/dbkfrtdjm/image/upload", { method: "post", body: data }).then(resp => resp.json()).then(async data => {
            setPicture(data.url)
            user.setURL(data.url);
            const result = await axios.put("https://connect-hub-88o5.onrender.com/user/changepicture", { picture: data.url }, { headers: { Authorization: `Bearer ${user.token}` } });
        }).catch(err => console.log(err));
    }

    const deletePost = async (postId) => {
        try {
            const result = await axios.delete(`https://connect-hub-88o5.onrender.com/post/${postId}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            getMyPosts();
        } catch (error) {
            console.log(error.message)
        }

    }

    const deleteComment = async (postId, commentId) => {
        try {
            const result = await axios.delete(`https://connect-hub-88o5.onrender.com/post/deletecomment/${postId}/${commentId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            getMyPosts();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        localStorage.getItem("Token") ?
            <div id="my-profile-page">
                <Navigation />
                <div id="profile-picture-div">
                    <input type='file' ref={ imageInputRef } hidden onChange={ (event) => { addPicture(event.target.files[0]) } } />
                    <Avatar style={ { cursor: "pointer" } } onClick={ clickInput } id="my-profile-picture" src={ picture } />
                    <h2 id="name">{ name }</h2>
                    <span id="friends-count">{ numOfFriends } Following</span>
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
                            <Avatar style={ { cursor: "pointer" } } className="new-post-personal-picture" src={ picture } />
                            <textarea id="new-post-textarea" placeholder="What's on your mind?" onChange={ postContentHandle }></textarea>
                            <button id="post-button" style={ { cursor: "pointer" } } onClick={ postHandle }>Post</button>
                        </div>
                        <div id="my-posts">
                            { myPosts && myPosts.map((element) => {
                                return (
                                    <div key={ element._id } className='posts'>
                                        <div id="my-post-author-info">
                                            <Avatar style={ { cursor: "pointer" } } className="new-post-personal-picture" src={ picture } />
                                            <h6 className='post-author'>{ name }</h6>
                                            <FaWindowClose id="delete-post-button" style={ { cursor: "pointer" } } onClick={ () => { deletePost(element._id) } } />
                                        </div>
                                        <div id="post-content">
                                            <p id="comment-text" style={ { fontFamily: "Chivo" } }>{ element.description }</p>
                                            { element.picture ? <img className="post-image" src={ element.picture } /> : "" }

                                        </div>
                                        <div id="like-and-comment">
                                            <div className='aligning-reactions reaction-area'>
                                                <AiFillLike className='reaction-buttons-size' style={ { cursor: "pointer" } } onClick={ () => { (Like(element._id)) } } />
                                                <span>{ element.numberOfLikes } Likes</span>
                                            </div>
                                            {
                                                isClicked === element._id ?
                                                    <div className='aligning-reactions reaction-area'>
                                                        <FaRegCommentAlt className='reaction-buttons-size' style={ { cursor: "pointer" } } onClick={ () => { setIsClicked("") } } />
                                                        <span className="margin-num-of-comments">{ element.comments.length } Comments</span>
                                                    </div>
                                                    :
                                                    <div className='aligning-reactions reaction-area'>
                                                        <FaRegCommentAlt className='reaction-buttons-size' style={ { cursor: "pointer" } } onClick={ () => { setIsClicked(element._id) } } />
                                                        <span className="margin-num-of-comments">{ element.comments.length } Comments</span>
                                                    </div>
                                            }
                                        </div>
                                        <div id="comment-section">
                                            {
                                                isClicked === element._id ?
                                                    <div id="comments">
                                                        <div id="new-comment">
                                                            <input placeholder='Comment...' id="new-comment-input" onChange={ (event) => { setComment(event.target.value) } } />
                                                            <button id="comment-button" style={ { cursor: "pointer" } } name={ element._id } onClick={ addComment }>Comment</button>
                                                        </div>
                                                        { element.comments.map((elem) => {
                                                            return (
                                                                <div key={ elem._id } id="comment">
                                                                    <div id="commenter-info">
                                                                        <Avatar className='new-post-personal-picture' src={ elem.commenter.picture } />
                                                                        <h6>{ elem.commenter.firstName + " " + elem.commenter.lastName }</h6>
                                                                        <FaWindowClose id="delete-comment-button" style={ { cursor: "pointer" } } onClick={ () => { deleteComment(element._id, elem._id) } } />
                                                                    </div>
                                                                    <div id="comment-text-div">
                                                                        <h5 id="comment-text">{ elem.description }</h5>
                                                                    </div>
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