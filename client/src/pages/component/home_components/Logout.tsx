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
        <button className="text-lg mr-18 text-white hover:cursor-pointer hover:bg-gray-300 mt-3 pr-3 pl-3 pb-2 pt-2 bg-violet-500 shadow font-normal" onClick={handleClick}> 
            Logout 
        </button>
    )
}

export default Logout;