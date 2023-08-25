import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import "./Navigation.css"
const Navigation = () => {
    const user = useContext(UserContext);
    const [URL, setURL] = useState("");
    const pictureHandle = async () => {
        const result = await axios.get(`http://localhost:5000/user/${user.userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
        console.log(result.data)
        setURL(result.data.userInfo.picture)
    }

    useEffect(() => {
        pictureHandle();
    }, [])

    return (
                user.token &&
                <div>
                    <img id = "profile-picture" src={ URL }/>
                </div>
    )
}

export default Navigation