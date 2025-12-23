import { Outlet, useNavigate } from "react-router-dom";
import { useEffect  } from "react";
import useAuth from "../context/useAuth";
import Spinner from "./helper/Spinner";

function ProtectedRoute() {
    const { status } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {      
        if (status == 'Unauthenticated') {
            navigate('/');
        }
    }, [status, navigate])

    if (status == 'Unauthenticated') {
        return <Spinner/> 
    }

    return (
        <Outlet/>
    )
}

export default ProtectedRoute;