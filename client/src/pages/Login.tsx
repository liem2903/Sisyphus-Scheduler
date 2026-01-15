import { Google } from '../helpers/loginHelper';
import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import Spinner from './component/Spinner'

function Login () {
    const navigate = useNavigate();
    const { status  } = useAuth();
    const [ clicked, clickButton ] = useState(false);

    const handleClick = () => {
        clickButton(true);
        Google();
    }


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
                <div> <h1 className="font-sans text-6xl font-semibold text-violet-500"> Welcome To Sisyphus </h1> </div> 
                <div> <h2 className="font-sans text-1xl text-violet-500"> Your Scheduling Assistant </h2> </div> 
            </div>
                <button className="flex justify-center items-center w-5/13 h-18 bg-violet-500 rounded-3xl mb-16 drop-shadow-2xl border-2 hover:border-black hover:cursor-pointer hover:shadow-none transition-all transform hover:translate-y-1" disabled={clicked} onClick={handleClick}>  
                    <div className="flex gap-2.5">
                        <h2 className="text-black shadow-2xl font-bold text-xl"> Continue with Google </h2> 
                    </div>
                </button> 
            </div>
            }
                           
        </div>       
    )
}

export default Login;