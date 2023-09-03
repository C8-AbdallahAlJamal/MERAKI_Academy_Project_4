import React, { useContext } from 'react'
import { BiHomeAlt2 } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useEffect } from 'react';
import "./Navigation.css"
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';

const Navigation = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [value, setValue] = useState("");
    const pictureHandle = async () => {
        if (localStorage.getItem("Token")) {
            const result = await axios.get(`http://localhost:5000/user/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
            if (result.data.success) {
                user.setURL(result.data.userInfo.picture);
            } else {
                navigate("/");
            }
        }
    }

    useEffect(() => {
        pictureHandle();
    }, [])

    const homeButtonHandle = () => {
        localStorage.getItem("Token") ? navigate("/Dashboard") : navigate("/");
    }
    const handleLogOut = () => {
        localStorage.clear();
        user.setToken(null);
        user.setUserId(null);
        navigate("/");
    }
    const goToMyProfile = () => {
        if (localStorage.getItem("Token")) {
            navigate("/MyProfile");
        } else {
            navigate("/");
        }
    }

    const getAllUsers = async () => {
        try {
            const result = await axios.get("http://localhost:5000/user/all/users", { headers: { Authorization: `Bearer ${user.token}` } });
            if (result.data.result.length > 0) {
                setSearchedUsers(result.data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const followUser = async (event) => {
        try {
            const result = await axios.put(`http://localhost:5000/user/addfriend/${event}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            user.setFriends(result.data.userFriendsList);
        } catch (error) {
            console.log(error.message);
        }
    }

    const UnfollowUser = async (event) => {
        try {
            const result = await axios.put(`http://localhost:5000/user/removefriend/${event}`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
            user.setFriends(result.data.userFriendsList);
        } catch (error) {

        }
    }

    return (
        localStorage.getItem("Token") &&
        <div id="navigation">
            <BiHomeAlt2 id="home-button" onClick={ homeButtonHandle } style={ { cursor: "pointer" } } />
            <Avatar id="navigation-picture" src={ user.URL } onClick={ goToMyProfile } style={ { cursor: "pointer" } } />
            <div id="search-bar-outer">
                <div id="search-bar-inner">
                    <input id="search-bar" onClick={ getAllUsers } type="text" onChange={ (event) => { setValue(event.target.value) } } placeholder='Search...' />
                    <div id="search-list">
                        { searchedUsers.filter(element => {
                            const word = value.toLowerCase();
                            const fullName = (element.firstName + " " + element.lastName).toLowerCase();
                            return fullName.includes(word);
                        }).map((element) => {
                            return (
                                <div id = "item-outer">
                                    <div id="item" key={ element._id }>
                                        <Avatar style={{cursor: "pointer"}} onMouseDown={ () => { navigate(`/profile/${element._id}`) } }  src={ element.picture } />
                                        <h4 className='item-name' style={ { cursor: "pointer" } } onMouseDown={ () => { navigate(`/profile/${element._id}`) } }>{ element.firstName + " " + element.lastName }</h4>

                                        {
                                            !user.friends.find((item) => { return item._id === element._id; }) ?

                                                <button id = "follow-button" style={ { cursor: "pointer" } } className='connection-button' name={ element._id } onClick={ () => { followUser(element._id) } }>Follow</button>
                                                :
                                                <button id = "unfollow-button" style={ { cursor: "pointer" } } className='connection-button' name={ element._id } onClick={ () => { UnfollowUser(element._id) } }>Unfollow</button>
                                        }
                                    </div>
                                </div>
                            )
                        }) }
                    </div>
                </div>
            </div>

            <FiLogOut id="navigation-logout" style={ { cursor: "pointer" } } onClick={ handleLogOut } />
        </div>
    )
}

export default Navigation