import React from 'react'
import Navigation from '../Navigation/Navigation'
import { useContext } from 'react'
import { UserContext } from '../../App'
import "./Dashboard.css"
const Dashboard = () => {
    const user = useContext(UserContext);
    return (
        <div id = "dashboard">
            <Navigation />
        </div>
    )
}

export default Dashboard