import React, { useContext } from 'react'
import { useNavigate,Link } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useEffect } from 'react';
import "./Navigation.css"
import { useState } from 'react';;
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
            <img id="profile-picture" src={ user.URL } onClick={ goToMyProfile } />
            <svg onClick={ homeButtonHandle } xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
            </svg>
            <div id="search-bar-outer">
                <div id="search-bar-inner">
                    <input onClick={ getAllUsers } type="text" onChange={ (event) => { setValue(event.target.value) } } placeholder='Search...' />
                        <div  id="search-list">
                        { searchedUsers.filter(element => {
                            const word = value.toLowerCase();
                            const fullName = (element.firstName + " " + element.lastName).toLowerCase();
                            return fullName.includes(word);
                        }).map((element) => {
                            return (
                                <div  style={ { cursor: "pointer" } } id="item" key={ element._id }>
                                    <h4 onMouseDown={ () => { navigate(`/profile/${element._id}`) } }>{ element.firstName + " " + element.lastName }</h4>
                                    
                                    {
                                        !user.friends.find((item) => { return item._id === element._id; }) ?
                                            
                                        <button name={ element._id } onClick={ ()=>{followUser(element._id)} }>Follow</button>
                                        :
                                        <button name={ element._id } onClick={ ()=>{UnfollowUser(element._id)} }>Unfollow</button>
                                    }
                                </div>
                            )
                        }) }
                    </div>
                </div>
            </div>
            <svg onClick={ handleLogOut } xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
            </svg>
        </div>
    )
}

export default Navigation