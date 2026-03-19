import React, { useState } from 'react';
import FlipButton from './FlipButton';
import { api } from '../../../interceptor/interceptor';
import type { busyDates } from '../../../types/types';
import { User, UserRound } from 'lucide-react';

type prop = {
    last_seen: string,
    id: string,
    changed_name: string,
    status: string,
    openCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    setBusyDates: React.Dispatch<React.SetStateAction<busyDates[]>>,
    startWeek: String,
    endWeek: String,
    setCalendarId: React.Dispatch<React.SetStateAction<string>>,
    trash: boolean,
    openUnfriend: React.Dispatch<React.SetStateAction<boolean>>,
    setUnfriendId: React.Dispatch<React.SetStateAction<string>>,
    setDeletedFriendName: React.Dispatch<React.SetStateAction<string>>,
}


function FriendBlock({setDeletedFriendName, setUnfriendId, last_seen, id, changed_name, status, openCalendar, setBusyDates, startWeek, endWeek, setCalendarId, trash, openUnfriend}: prop) {
    const [ flipped, flipOver ] = useState(false);
    const [ newName, setNewName] = useState("");
    const [ placeHolderName, setPlaceholderName ] = useState(changed_name);
    const [ successfulChange, showSuccessfulChange ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ successMessage, setSuccessMessage ] = useState("");
    const [ cantFlip, lockFlip ] = useState(false);
    const [ lastSeenState, changeLastSeen ] = useState(last_seen);
    const [ statusState, changeStatus ] = useState(status);
    const [ hovered, setHover ] = useState(false);

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === "Enter") {
            e.preventDefault();

            try {
                lockFlip(true);

                await api.patch('friend/change-friend-name', {id: id, name: newName}, {withCredentials: true});
                setPlaceholderName(newName);
                setNewName("");
                setErrorMessage("");
                showSuccessfulChange(true);
                setSuccessMessage("Successfully changed name");

                let duration = await api.get(`/friend/get-last-seen`, {params: { name: newName }, withCredentials: true});
                let new_seen = ""
                
                if (duration.data.data.last_seen == "Untracked") {
                    new_seen = `${duration.data.data.last_seen}`;
                } else if (parseInt(duration.data.data.last_seen) > 1) {
                    new_seen = `${duration.data.data.last_seen} days ago`;
                } else {
                    new_seen = `${duration.data.data.last_seen} day ago`;
                }

                changeLastSeen(new_seen);
                changeStatus(duration.data.data.status);

                lockFlip(false);
            } catch (err: any) {
                setErrorMessage(err.response.data.error);
                showSuccessfulChange(false);
            }
        }
    }

    const handleOpenCalendar = async () => {
        let taken_slots = await api.get(`/friend/get-availabilities`, {params: {friend_id: id, start_date: startWeek, end_date: endWeek}, withCredentials: true});
        setCalendarId(id);

        const events = taken_slots.data.data.map((b: busyDates) => ({
            start: b.start,
            end: b.end,
            display: "background",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            overlap: false,
        }));

        setBusyDates(events);
        openCalendar(true);
    }

    const handleClick = () => {
        if (trash) {
            setUnfriendId(id);
            openUnfriend(true);
            setDeletedFriendName(placeHolderName);
        }
    }

    return <>
        <div className='perspective-[1000px]'>
            <div className={[flipped? "rotate-y-180 relative ml-[2vw] mr-[2vw] w-[clamp(1em,11vw,100em)] pt-[5vh] pb-[5vh] transform-3d duration-150": "ml-[2vw] mr-[2vw] w-[clamp(1em,11vw,100em)] pt-[5vh] pb-[5vh] relative transform-3d duration-150"].join(" ")}>                                                
                <div className={["absolute inset-0 flex flex-col items-center bg-[#F5ECD7] rotate-y-0 hide-back transform duration-500 shadow-[0_4px_30px_0_rgba(0,0,0,0.3)] rounded-lg", hovered && !trash ? "scale-110" : "", hovered && trash ? "hover:bg-[#8B3A3A]/80 hover:justify-center hover:items-center hover:cursor-pointer hover:animate-pulse" : '', trash && !hovered ? 'border border-red-500 bg-[#F5ECD7]/80' : ''].join(" ")} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => handleClick()}>   
                    { trash && hovered ? <div className='text-[clamp(0.5rem,1vw,2rem)] text-center font-bold text-white italic'> Delete friend </div> :
                        <div>
                            <div className="flex justify-center items-center"> 
                                <FlipButton flipped={flipped} flipOver={flipOver} cantFlip={cantFlip}/>
                                <div className="text-[clamp(0.5rem,1vw,2rem)]">
                                    {placeHolderName}
                                </div>  
                                <button onClick={() => handleOpenCalendar()} className={["w-[clamp(1rem,1.25vw,100rem)] aspect-3/2 rounded-full absolute right-1 md:top-0.5 bottom-0.5 top-auto md:bottom-auto hover:cursor-pointer justify-center items-center hover:ring-2 hover:ring-violet-400/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200", statusState === "Green" && "bg-green-400", statusState === "Orange" && "bg-orange-400", statusState === "Red" && "bg-red-400"].join(" ")}> <UserRound size="[10vw]"/> </button> 
                            </div>
                            <div className="flex gap-[0.5vw] text-[clamp(0.5rem,1vw,2rem)]">
                                <div className='hidden xl:block'> Last Seen: </div> <div className='font-semibold'> {lastSeenState} </div>  
                            </div>
                        </div>
                    }
                </div>  

                <div className={["absolute inset-0 flex flex-col items-center bg-[#F5ECD7] rotate-y-180 hide-back transform duration-500 shadow-[0_4px_30px_0_rgba(0,0,0,0.3)] rounded-lg", hovered && !trash ? "scale-110" : "", hovered && trash ? "hover:bg-[#8B3A3A]/80 hover:justify-center hover:items-center hover:cursor-pointer  hover:animate-pulse" : "", trash && !hovered ? 'border border-red-500 bg-[#F5ECD7]/80' : ''].join(" ")} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {trash && hovered ? <div className='text-[clamp(0.5rem,1vw,2rem)] text-center font-bold text-white italic'> Delete friend </div> : 
                        <div className="flex justify-center items-center"> 
                            <FlipButton flipped={flipped} flipOver={flipOver} cantFlip={cantFlip}/>
                            <div className="flex flex-col justify-center items-center">
                                <div className="mt-[0.5vh] text-[clamp(0.1rem,1vw,2rem)]"> 
                                    Change name: 
                                </div>
                                <div className='flex flex-col justify-center items-center'> 
                                    <input type="text" placeholder={placeHolderName} value={newName} onClick={() => {showSuccessfulChange(false); setErrorMessage(""); setSuccessMessage("")}} onChange={(e) => {setNewName(e.target.value)}} onKeyDown={(e) => handleEnter(e, id)} className={[['w-[9vw] border-2 mt-[0.5vh] text-center, focus:outline-0 text-[1vw]', successfulChange ? "border-green-500" : ""].join(" "), errorMessage.length > 0 ? "border-red-500" : ""].join(" ")}/> 
                                    <div className={['text-center font-bold text-xs pt-[0.5vh]', successfulChange ? "text-green-500" : "text-red-500"].join(" ")}> {successfulChange ? successMessage : errorMessage} </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </>
}

export default FriendBlock;