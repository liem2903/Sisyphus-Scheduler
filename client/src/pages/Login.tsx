import { Google } from '../helpers/loginHelper';
import { FcGoogle } from 'react-icons/fc';

function Login () {
    return (
        <div className="flex flex-col justify-evenly items-center w-full h-screen">
            <div className="flex flex-col items-center gap-3">
                <div> <h1 className="font-sans text-6xl font-semibold text-violet-500"> Welcome To Sisyphus </h1> </div> 
                <div> <h2 className="font-sans text-1xl text-violet-500"> Your Scheduling Assistant </h2> </div> 
            </div>
            <button className="flex justify-center items-center w-4/12 h-18 bg-violet-400 rounded-3xl mb-16 hover:drop-shadow-2xl outline-black hover:bg-violet-200 hover:cursor-grab hover:shadow-lg transition-all transform hover:translate-y-1" onClick={Google}> 
                <div className="flex gap-2.5">
                    <FcGoogle size={36}/>
                    <h2 className="text-2xl text-white font-bold"> Continue with Google </h2> 
                </div>
                
            </button>                
        </div>       
    )
}

export default Login;