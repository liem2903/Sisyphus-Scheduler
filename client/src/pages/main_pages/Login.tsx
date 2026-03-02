import { useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import Spinner from '../component/global_components/Spinner'
import GoogleButton from '../component/global_components/GoogleButton';

function Login () {
    const navigate = useNavigate();
    const { status  } = useAuth();

    useEffect(() => {
        if (status == "authenticated") {
            navigate('/home');
        }
    }, [status])

    return (
        <div>
            {status == "loading" ? <Spinner/> : 
                        
            <div className="flex flex-col justify-evenly items-center w-full h-screen">
                <div className="flex flex-col items-center gap-3">
                <div> <h1 className="font-sans text-[clamp(1rem,10vw,3.5rem)] font-semibold text-violet-500"> Welcome To Sisyphus </h1> </div> 
                <div> <h2 className="font-sans text-1xl text-violet-500"> Your Scheduling Assistant </h2> </div> 
            </div>
                <GoogleButton/> 
            </div>
            }
                           
        </div>       
    )
}

export default Login;