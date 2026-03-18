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
            {status == "loading" ? <div className='w-screen h-screen bg-linear-to-b to-[#8B5E3C] from-[#ebdfc4] flex justify-center'> <Spinner/> </div> : 
                        
            <div className="flex flex-col justify-evenly items-center w-full h-screen bg-linear-to-b to-[#8B5E3C] from-[#ebdfc4]">
                <div className="flex flex-col items-center gap-3">
                <div> <h1 className="font-sans text-[clamp(1rem,10vw,3.5rem)] bg-linear-to-r from-[#3B1F0E] via-[#86776e] to-[#3B1F0E] font-semibold bg-clip-text text-transparent bg-size-[400%] animate-colour-wave"> Welcome To Sisyphus </h1> </div> 
                <div> <h2 className="font-sans text-1xl text-[#3B1F0E] italic"> Your Scheduling Assistant </h2> </div> 
            </div>
                <GoogleButton/> 
            </div>
            }
                           
        </div>       
    )
}

export default Login;