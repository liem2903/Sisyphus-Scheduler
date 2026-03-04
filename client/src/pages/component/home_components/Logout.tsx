import axios from "axios";
import useAuth from "../../../context/useAuth";

function Logout () {
    const {setStatus } = useAuth();

    const handleClick = async () => {
        // Delete refresh and access cookies.
        await axios.get('/api/auth/refresh/logout', { withCredentials: true });
        setStatus("unauthenticated");
    }
    
    return (
        <button className="text-lg mr-18 text-black hover:cursor-pointer hover:ring-2 hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 mt-3 pr-3 pl-3 pb-2 pt-2 bg-violet-400 font-normal rounded-[1vw]" onClick={handleClick}> 
            Logout 
        </button>
    )
}

export default Logout;