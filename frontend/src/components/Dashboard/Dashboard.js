import React from 'react'
import Navigation from '../Navigation/Navigation'
import { useNavigate } from "react-router-dom";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaWindowClose } from "react-icons/fa";
import Avatar from '@mui/material/Avatar';
import "./Dashboard.css";
import axios from 'axios';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useState } from 'react';
const Dashboard = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [posts, setPosts] = useState("");
    const [isClicked, setIsClicked] = useState("");
    const [comment, setComment] = useState("");
    const [postContent, setPostContent] = useState("");
    useEffect(() => {
        if (localStorage.getItem("Token")) {
            getUserInfo();
            getPosts();
        } else {
            navigate("/");
        }
    }, [])

    const getPosts = async () => {
        try {
            const result = await axios.get("https://connect-hub-88o5.onrender.com/"+`/post/`, { headers: { Authorization: `Bearer ${user.token}` } });
            setPosts(result.data.posts);

        } catch (error) {
            console.log(error.message);
        }
    }

    const getUserInfo = async () => {
        try {
            const result = await axios.get("https://connect-hub-88o5.onrender.com/"+`/user/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
        } catch (error) {
            console.log(error.message);
        }
    }

    const Like = async (postId) => {
        try {
            const result = await axios.put("https://connect-hub-88o5.onrender.com/"+`/post/${postId}/like`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
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
                const result = await axios.post("https://connect-hub-88o5.onrender.com/"+`/post/${event.target.name}/comment`, { description }, { headers: { Authorization: `Bearer ${user.token}` } });
                setPosts(posts.map((element) => {
                    if (result.data.result._id === element._id) {
                        element.comments.push(result.data.comment);
                    }
                    return element;
                }));
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

    const postContentHandle = (event) => {
        setPostContent(event.target.value);
    }

    const postHandle = async () => {
        if (localStorage.getItem("Token")) {
            if (postContent !== "") {
                try {
                    const result = await axios.post("https://connect-hub-88o5.onrender.com/"+"/post/", { description: postContent, picture: "" }, { headers: { Authorization: `Bearer ${user.token}` } });
                    setPosts([result.data.post, ...posts]);
                } catch (error) {
                    console.log(error.message);
                }
            }

        } else {
            navigate("/");
        }
    }

    const deletePost = async (postId) => {
        try {
            const result = await axios.delete("https://connect-hub-88o5.onrender.com/"+`/post/${postId}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            getPosts();
        } catch (error) {
            console.log(error.message)
        }

    }

    const deleteComment = async (postId, commentId) => {
        try {
            const result = await axios.delete("https://connect-hub-88o5.onrender.com/"+`/post/deletecomment/${postId}/${commentId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            getPosts();
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        localStorage.getItem("Token") ?
            <div id="dashboard">
                <Navigation />
                <div id="posts">
                    <div id="add-post">
                        <Avatar style={ { cursor: "pointer" } } className="new-post-personal-picture" src={ user.URL } />
                        <textarea id="new-post-textarea" placeholder="What's on your mind?" onChange={ postContentHandle }></textarea>
                        <button id="post-button" style={ { cursor: "pointer" } } onClick={ postHandle }>Post</button>
                    </div>
                    {

                        posts && posts.map((element) => {
                            return (
                                <div key={ element._id } className='dashboard-posts'>
                                    <div id='my-post-author-info'>
                                        <Avatar style={ { cursor: "pointer" } } className='new-post-personal-picture' src={ element.author.picture } onClick={ () => { goToUserProfile(element.author._id) } } />
                                        <h6 style={ { cursor: "pointer" } } onClick={ () => { goToUserProfile(element.author._id) } } className='post-author'>{ element.author.firstName + " " + element.author.lastName }</h6>

                                        { element.author._id === user.userId ? <FaWindowClose id="delete-post-button-dashboard" style={ { cursor: "pointer" } } onClick={ () => { deletePost(element._id) } } /> : "" }

                                    </div>
                                    <div id="post-content">
                                        <p> { element.description }</p>
                                        <img className="post-image" src={ element.picture } />
                                    </div>
                                    <div id="like-and-comment">
                                        <div class="aligning-reactions reaction-area">
                                            <AiFillLike className='reaction-buttons-size' style={ { cursor: "pointer" } } onClick={ () => { (Like(element._id)) } } />
                                            <span>{ element.numberOfLikes }Likes</span>
                                        </div>
                                        {
                                            isClicked === element._id ?
                                                <div class="aligning-reactions reaction-area">
                                                    <FaRegCommentAlt className='reaction-buttons-size' style={ { cursor: "pointer" } } onClick={ () => { setIsClicked("") } } />
                                                    <span className="margin-num-of-comments">{ element.comments.length } Comments</span>
                                                </div>
                                                :
                                                <div class="aligning-reactions reaction-area">
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
                                                        <input placeholder="Comment..." id='new-comment-input' onChange={ (event) => { setComment(event.target.value) } } />
                                                        <button id='comment-button' style={ { cursor: "pointer" } } name={ element._id } onClick={ addComment }>Comment</button>
                                                    </div>
                                                    { element.comments.map((elem) => {
                                                        return (
                                                            <div key={ elem._id } id="comment">
                                                                <div id="commenter-info">
                                                                    <Avatar onClick={ () => { goToUserProfile(elem.commenter._id) } } className='new-post-personal-picture' src={ elem.commenter.picture } />
                                                                    <h6 >{ elem.commenter.firstName + " " + elem.commenter.lastName }</h6>
                                                                    {
                                                                        elem.commenter._id === user.userId || element.author._id === user.userId ?
                                                                            <FaWindowClose id="delete-comment-button" style={ { cursor: "pointer" } } onClick={ () => { deleteComment(element._id, elem._id) } } />
                                                                            :
                                                                            ""
                                                                    }
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
                        })
                    }
                </div>
            </div>
            :
            navigate("/")
    )
}

export default Dashboard