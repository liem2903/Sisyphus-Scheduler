import { Outlet, useNavigate } from "react-router-dom";
import { useEffect  } from "react";
import useAuth from "../../../context/useAuth";
import Spinner from "./Spinner";
import Header from "../home_components/Header";

function ProtectedRoute() {
    const { status } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {      
        if (status == 'unauthenticated') {
            navigate('/');
        }
    }, [status, navigate])

    if (status == 'loading') {
        return <Spinner/> 
    } else {
        return (
            <>
                <Header/>
                <Outlet/>        
            </>
        )
    }
    }


export default ProtectedRoute;