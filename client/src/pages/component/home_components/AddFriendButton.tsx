import { UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react'; 
import { api } from '../../../interceptor/interceptor';
import Spinner from '../global_components/Spinner';

function AddFriendButton() {
    const [ popup, setPopup ] = useState(false);
    const [ friendCode, typeFriendCode ] = useState("");
    const [ error, setError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ ownFriendCode, getFriendCode ] = useState("");
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const getUserFriendCode = async () => {
            setLoading(true);
            let code = await api.get(`user/get-friend-code`, {withCredentials: true});
            getFriendCode(code.data.data.friend_code);
            setLoading(false);
        }

        getUserFriendCode();
    }, [])

    const handleKeyDown = async (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();

            try {
                await api.post(`friend/post-friend-request`, {code: friendCode}, {withCredentials: true});
            } catch (err: any) {
                setErrorMessage(err.response.data.error);
                setError(true);
            }
                
            typeFriendCode("");
        }
    }

    return <>
        <div className="w-1/4 flex justify-center items-center relative" onMouseEnter={() => setPopup(true)} onMouseLeave={() => setPopup(false)}>
            <div className="rounded-full border-2 w-1/1 h-1/1 flex justify-center items-center hover:bg-amber-50">
                <UserPlus size="15"/>

                {popup && 
                <div className="absolute top-[1vh] w-[12.5vw] overflow-scroll z-100 no-scrollbar right-[0.25vw] bg-[#F1EDFF] h-[30vh] pt-[1vh] flex-col flex items-center">
                    {loading ? <Spinner/> : 
                        <>
                            <div className='flex justify-evenly items-center w-7/8'> <div className= 'h-[0.25vh] border-[0.1vh] w-[2vw]'> </div> <div className='text-black font-bold'> Add Friend </div>  <div className='h-[0.25vh] border-[0.1vh] w-[2vw]'> </div> </div>
                            <div className='bg-violet-300 w-7/8 border-[0.1vh] border-violet-500 rounded-sm h-[13vh] flex text-center pt-[2vh] flex-col shadow-xs'> 
                                <div className='text-[clamp(0.1rem,0.75vw,2rem)] text-violet-50'> To add someone to your friend list enter their friend code below </div>
                                <div className="w-full justify-center pt-[1vh] h-1/2"> <input type="search" placeholder="0A0C D2E3" className='w-7/8 h-full border-2 border-violet-500 text-center focus:outline-0 text-[clamp(0.1rem,1vw,2rem)]' value={friendCode} onClick={() => {setError(false); setErrorMessage("")}} onChange={(e) => typeFriendCode(e.target.value)} onKeyDown={handleKeyDown}/> </div>
                                {error && <div className='text-red-500 font-extrabold text-[0.65vw] underline'> {errorMessage} </div>}
                            </div>
                            
                            <div className='flex justify-evenly items-center w-7/8 mt-[1vh]'> <div className='h-[0.25vh] border-[0.1vh] w-[1.28vw]'> </div> <div className='text-black font-bold text-[clamp(0.1rem,1vw,2rem)]'> My Friend Code </div>  <div className='h-[0.25vh] border-[0.1vh] w-[1.28vw]'> </div> </div>
                            <div className='bg-violet-300 w-7/8 border-[0.1vh] border-violet-500 rounded-sm h-[7vh] shadow-xs'> 
                                <div className="text-[clamp(0.1rem,1.15vw,1.5rem)] pl-[1vw] pt-[0.5vh]"> 
                                    Friend Code: 
                                </div> 
                                <div>
                                    <div className='pl-[1vw] pb-[1vw] text-[clamp(0.1rem,1.15vw,1.5rem)] text-violet-50'> {ownFriendCode} </div>
                                </div>
                            </div>
                        </>
                    }
                    
                </div>
                }
            </div>
        </div>
         
    </>
}

export default AddFriendButton;