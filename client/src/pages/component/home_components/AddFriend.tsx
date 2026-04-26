import { Clipboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'; 
import { api } from '../../../interceptor/interceptor';

type Prop = {
    openAddFriends: React.Dispatch<React.SetStateAction<boolean>>,
    code: string,
}

function AddFriend({openAddFriends, code}: Prop) {
    const [ friendCode, typeFriendCode ] = useState("");
    const [ error, setError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ successfulCopy, setCopySuccessful ] = useState(false);

    const textFocus = useRef<HTMLInputElement | null >(null);
    
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

        await navigator.clipboard.writeText(code);
        setCopySuccessful(true);
    }

    return <>
        <div className="inset-0 absolute z-1008 flex justify-center items-center">
            <div className="inset-0 absolute bg-black/50" onClick={() => openAddFriends(false)}/>
            <div className="absolute w-[clamp(17rem,25vw,100rem)] overflow-scroll z-100 no-scrollbar bg-[#3B1F0E] rounded-lg pt-[clamp(1rem,3vh,100rem)] pb-[clamp(1rem,3vh,100rem)] flex-col flex items-center shadow-[inset_0_4px_5px_0_rgba(0,0,0,0.3)] ">
                
                <>
                    <div className='bg-[#F5ECD7] w-[clamp(12rem,20vw,100rem)] rounded-sm flex-col flex items-center relative transition duration-500 shadow-[inset_0_15px_5px_0_rgba(0,0,0,0.1)]' onClick={() => setCopySuccessful(false)}> 
                        <div className="text-[clamp(1rem,1.5vw,2rem)] text-[#3B1F0E] pl-[1vw] pt-[0.5vh]"> 
                            My Friend Code 
                        </div> 
                        <div className='flex'>
                            <div className='pl-[1vw] text-[clamp(1rem,1.5vw,2rem)] text-[#3B1F0E] hover:cursor-text' ref={textFocus}> {code} </div>
                            <button className="w-[clamp(1rem,3vw,3rem)] aspect-4/3 rounded-full flex justify-center items-center absolute right-[0.75vw] bottom-[1vh] hover:cursor-pointer z-20 bg-[#4A7C59] transition duration-250 shadow-[0_4px_40px_0_rgba(0,0,0,0.4)] hover:ring-2 hover:ring-[#4A7C59] hover:ring-offset-2 hover:ring-offset-black/40" onClick={copy}> <Clipboard size="2vw"/> </button>
                            <div className={['w-[7vw] bg-[#4A7C59] rounded-full flex justify-center items-center absolute right-0 bottom-1 z-10 text-[#F5ECD7] transition duration-150 opacity-0 text-[clamp(0.5rem,2vw,1rem)]', successfulCopy ? "opacity-100 transform translate-y-[-2.5vw] shadow-[0_4px_40px_0_rgba(0,0,0,0.4)]"  : ""].join(" ")}> Copied! </div>
                        </div>
                    </div>

                    <div className='bg-[#F5ECD7] w-[clamp(12rem,20vw,100rem)] flex text-center flex-col mt-[3vh] rounded-md transition duration-500 shadow-[0_4px_40px_0_rgba(0,0,0,0.2)]'> 
                        <div className="justify-center text-[#3B1F0E] pb-[1vh] pt-[1vh]"> <input type="search" placeholder="Type friend's code here" className='w-7/8 rounded-full text-center focus:outline-0 text-[clamp(0.8rem,1vw,2rem)]' value={friendCode} onClick={() => {setError(false); setErrorMessage("")}} onChange={(e) => typeFriendCode(e.target.value)} onKeyDown={handleKeyDown}/> </div>
                    </div>

                    {error && <div className='text-red-500 font-extrabold text-[0.65vw] underline'> {errorMessage} </div>}

                </>
                                
            </div> 
        </div>
    </>
}

export default AddFriend;