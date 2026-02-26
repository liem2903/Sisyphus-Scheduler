import { Clipboard, UserPlus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'; 
import { api } from '../../../interceptor/interceptor';
import Spinner from '../global_components/Spinner';

type Prop = {
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>,
}

function AddFriend({openAddFriends}: Prop) {
    const [ friendCode, typeFriendCode ] = useState("");
    const [ error, setError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ ownFriendCode, getFriendCode ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ successfulCopy, setCopySuccessful ] = useState(false);

    const textFocus = useRef<HTMLInputElement | null >(null);

    useEffect(() => {
        const getUserFriendCode = async () => {
            setLoading(true);
            let code = await api.get(`/user/get-friend-code`, {withCredentials: true});
            getFriendCode(code.data.data.friend_code);
            setLoading(false);
        }

        getUserFriendCode();
    }, [])

    useEffect(() => {
        if (friendCode.length > 8) {
            typeFriendCode(friendCode.slice(0, 8))
        } 
    }, [friendCode])

    const handleKeyDown = async (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();

            try {
                await api.post(`/friend/post-friend-request`, {code: friendCode}, {withCredentials: true});
            } catch (err: any) {
                setErrorMessage(err.response.data.error);
                setError(true);
            }
                
            typeFriendCode("");
        }
    }

    const copy = async () => {
        setTimeout(() => {
            setCopySuccessful(false)
        }, 1000);

        await navigator.clipboard.writeText(ownFriendCode);
        setCopySuccessful(true);
    }

    return <>
        <div className="inset-0 absolute z-1008 flex justify-center items-center">
            <div className="inset-0 absolute bg-black/50" onClick={() => openAddFriends(false)}/>
            <div className="absolute w-[25vw] overflow-scroll z-100 no-scrollbar bg-[#F1EDFF] h-[30vh] pt-[1vh] flex-col flex items-center">
                {loading ? <Spinner/> : 
                    <>
                        <div className='bg-violet-300 w-7/8 border-violet-500 rounded-sm h-[8vh] shadow-xs flex-col flex items-center relative hover:bg-violet-400 transition duration-500' onClick={() => setCopySuccessful(false)}> 
                            <div className="text-[clamp(0.1rem,1.15vw,1.5rem)] pl-[1vw] pt-[0.5vh]"> 
                                My Friend Code 
                            </div> 
                            <div className='flex'>
                                <div className='pl-[1vw] pb-[1vw] text-[clamp(0.1rem,1.15vw,1.5rem)] text-violet-50 hover:cursor-text' ref={textFocus}> {ownFriendCode} </div>
                                <button className="w-[1vw] h-[2vh] rounded-full flex justify-center items-center absolute right-2 bottom-1 hover:cursor-pointer z-20 bg-violet-400 hover:bg-violet-500 transition duration-250" onClick={copy}> <Clipboard/> </button>
                                <div className={['w-[5vw] h-[3vh] bg-violet-500 rounded-full flex justify-center items-center absolute right-2 bottom-1 z-10 text-black transition duration-150 opacity-0', successfulCopy ? "opacity-100 transform translate-y-[-2vh] shadow-2xl"  : ""].join(" ")}> Copied! </div>
                            </div>
                        </div>

                        <div className='bg-violet-300 w-7/8 border-violet-500 h-[13vh] flex text-center flex-col shadow-xs mt-[3vh] rounded-md hover:bg-violet-400 transition duration-500'> 
                            <div className="text-[clamp(0.1rem,1.15vw,1.5rem)] pt-[0.5vh]"> Add a friend </div>
                            <div className="w-full justify-center pt-[1vh] h-1/2"> <input type="search" placeholder="0A0C D2E3" className='w-7/8 h-full border-2 rounded-full border-violet-500 text-center focus:outline-0 text-[clamp(0.1rem,1vw,2rem)]' value={friendCode} onClick={() => {setError(false); setErrorMessage("")}} onChange={(e) => typeFriendCode(e.target.value)} onKeyDown={handleKeyDown}/> </div>
                            {error && <div className='text-red-500 font-extrabold text-[0.65vw] underline'> {errorMessage} </div>}
                        </div>
                    </>
                }                
            </div> 
        </div>
    </>
}

export default AddFriend;