import React, {useContext} from 'react'
import { Link } from "react-router-dom";
import { UserContext } from '../../App';

const Navigation = () => {
    const user = useContext(UserContext);
    console.log(user);
    return (
        <div>
            {
                user.token &&
                <div>
                    
                </div>
            }
        </div>
    )
}

export default Navigation