import axios from "axios";
import useAuth from "../../../context/useAuth";
import { useState } from 'react'

function Logout () {
    const {setStatus } = useAuth();

    const [ loggingOut, logOut ] = useState(false);


    const handleClick = async () => {
        logOut(true);
        // Delete refresh and access cookies.
        await axios.get('/api/auth/refresh/logout', { withCredentials: true });
        setStatus("unauthenticated");
    }
    
    return (
        <button className={["text-lg mr-18 text-[#FFF8F0] font-bold mt-3 pr-3 pl-3 pb-2 pt-2 bg-[#4A7C59] rounded-[4vw] shadow-[0_4px_40px_0_rgba(0,0,0,0.3)]", loggingOut ? "animate-pulse bg-[#4A7C59]/70" : "hover:scale-110 hover:cursor-pointer hover:ring-2 hover:ring-[#4A7C59]/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200"].join(" ")} disabled={loggingOut} onClick={handleClick}> 
            {loggingOut ? "Logging Out..." : "Logout"} 
        </button>
    )
}

export default Logout;