// Changes colour based on how long ago.
import React, { useState } from 'react';
import FlipButton from './FlipButton';
import { api } from '../../../interceptor/interceptor';
import type { busyDates } from '../../../types/types';

type prop = {
    last_seen: string,
    id: string,
    changed_name: string,
    status: string,
    openCalender: React.Dispatch<React.SetStateAction<boolean>>,
    setBusyDates: React.Dispatch<React.SetStateAction<busyDates[]>>,
    startWeek: String,
    endWeek: String,
    setCalendarId: React.Dispatch<React.SetStateAction<string>>,
}
// Session:
//  1. Fix spacing issue of friend block - where it decreases in size way too much.
//  2. Fix friendship - where it changes when name is changed rather than having to reload.
//      b. Can not FLIP if name is currently being changed.


function FriendBlock({last_seen, id, changed_name, status, openCalender, setBusyDates, startWeek, endWeek, setCalendarId}: prop) {
    const [ flipped, flipOver ] = useState(false);
    const [ newName, setNewName] = useState("");
    const [ placeHolderName, setPlaceholderName ] = useState(changed_name);
    const [ successfulChange, showSuccessfulChange ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ successMessage, setSuccessMessage ] = useState("");
    const [ cantFlip, lockFlip ] = useState(false);
    const [ lastSeenState, changeLastSeen ] = useState(last_seen);
    const [ statusState, changeStatus ] = useState(status);

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

                let duration = await api.get(`friend/get-last-seen`, {params: { name: newName }, withCredentials: true});
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

    const handleOpenCalender = async () => {
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
        openCalender(true);
    }

    return <>
        <div className='perspective-[1000px]'>
            <div className={flipped? "rotate-y-180 relative ml-5 w-4/5 h-[10vh] transform-3d duration-500": "ml-5 w-4/5 h-[10vh] relative transform-3d duration-500"}> 
                <div className="absolute inset-0 flex flex-col items-center bg-[#F1EDFF] border-2 border-violet-400 rotate-y-0 hide-back">   
                    <div className="flex justify-center items-center"> 
                        <FlipButton flipped={flipped} flipOver={flipOver} cantFlip={cantFlip}/>
                        <div className="text-[clamp(0.1rem,1vw,2rem)]">
                            {placeHolderName}
                        </div>  
                        <button onClick={() => handleOpenCalender()} className={["w-[1.25vw] h-[2.5vh] rounded-full absolute right-1 top-0.5 hover:cursor-pointer", statusState === "Green" && "bg-green-400", statusState === "Orange" && "bg-orange-400", statusState === "Red" && "bg-red-400"].join(" ")}/> 
                    </div>
                    <div className="flex gap-[0.5vw] text-[clamp(0.1rem,1vw,2rem)]">
                        Last Seen: <div className='font-semibold'> {lastSeenState} </div>  
                    </div>
                </div>  

                <div className="absolute inset-0 flex flex-col items-center bg-[#F1EDFF] border-2 border-violet-400 rotate-y-180 hide-back"> 
                    <div className="flex justify-center items-center"> 
                        <FlipButton flipped={flipped} flipOver={flipOver} cantFlip={cantFlip}/>
                        <div className="flex flex-col justify-center items-center">
                            <div className="mt-[0.5vh] text-shadow-2xs text-[clamp(0.1rem,1vw,2rem)]"> 
                                Change name: 
                            </div>
                            <div className='flex flex-col justify-center items-center'> 
                                <input type="text" placeholder={placeHolderName} value={newName} onClick={() => {showSuccessfulChange(false); setErrorMessage(""); setSuccessMessage("")}} onChange={(e) => {setNewName(e.target.value)}} onKeyDown={(e) => handleEnter(e, id)} className={[['w-[9vw] border-2 mt-[0.5vh] text-center, focus:outline-0', successfulChange ? "border-green-500" : ""].join(" "), errorMessage.length > 0 ? "border-red-500" : ""].join(" ")}/> 
                                <div className={['text-center font-bold text-xs pt-[0.5vh]', successfulChange ? "text-green-500" : "text-red-500"].join(" ")}> {successfulChange ? successMessage : errorMessage} </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default FriendBlock;