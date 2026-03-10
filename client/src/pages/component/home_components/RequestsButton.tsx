import type {friendRequest, friends} from '../../../types/types'

type prop = {
    friendRequests: friendRequest[],
    setRequests: React.Dispatch<React.SetStateAction<friendRequest[]>>,
    setFriendList: React.Dispatch<React.SetStateAction<friends[]>>,
}

import { Inbox, Check, X } from "lucide-react";
import React, { useState } from 'react';
import { api } from '../../../interceptor/interceptor';

// I want to be able to hover over my button and then my requests will pop up. I can accept and decline requests accordingly - but once my mouse LEAVES the div then the pop up disappears. No overlap.
function RequestsButton ({friendRequests, setRequests, setFriendList}: prop) { 
    const [ popUp, setPopup ] = useState(false);
    const [ tickHovered, onTickHover ] = useState(false);
    const [ crossHovered, onCrossHover ] = useState(false);

    const handleAccept = async (req: friendRequest) => {
        await api.patch('/friend/accept-friend-request', {id: req.id, from_user: req.from_user},  {withCredentials: true});

        const tempReqList = friendRequests.filter((value) => {
            value.id == req.id;
        })

        setRequests(tempReqList);
        
        const list = await api.get('/friend/get-friends', {withCredentials: true});
        setFriendList(list.data.data); 
    }   

    const handleDecline = async (req: friendRequest) => {
        api.patch('/friend/decline-friend-request', {id: req.id});

        const tempReqList = friendRequests.filter((value) => {
            value.id == req.id;
        })

        setRequests(tempReqList);
    }   

    return <>
        <div className="w-[clamp(1rem,1.5vw,5rem)] flex justify-center items-center text-[#4A7C59]" onMouseEnter={() => setPopup(true)} onMouseLeave={() => setPopup(false)}>
            <div className="rounded-full w-1/1 aspect-square flex justify-center items-center hover:bg-amber-50 relative leading-none">
                <Inbox size={"clamp(1rem,1.5vw,100rem)"}/> 
                <div className="hidden absolute w-[0.75vw] rounded-full bottom-[1.2vh] left-[1vw] bg-red-200 md:flex md:justify-center md:items-center text-[clamp(0.5rem,1vw,100rem)]"> {friendRequests.length} </div>
                 
                <div className={["absolute top-[1.25vw] w-[12vw] overflow-scroll z-1005 no-scrollbar right-1 bg-[#F1EDFF] h-[20vh] pt-[1vh] flex-col flex items-center transition duration-250", popUp ? "opacity-100 translate-y-[0.25vh]" : "opacity-0 translate-y-0 pointer-events-none"].join(" ")}>
                    {friendRequests.length != 0 ? friendRequests.map((requests) => 
                        <div className="border border-violet-400/20 bg-violet-300 w-6/7 flex items-center justify-evenly gap-x-[1vw]"> 
                            <div className="pr-[0.5vw] text-[clamp(0.5rem,1vw,1rem)]">
                                {requests.requester_name}
                            </div>
                            <div className="flex gap-[0.1vw] pl-[0.4vw]">
                                <div className={crossHovered ? "hover:cursor-pointer" : ""} onMouseOver={() => onCrossHover(true)} onMouseLeave={() => onCrossHover(false)} onClick={() => {handleDecline(requests)}}> <X size="clamp(0.5rem,1vw,1rem)" color={crossHovered ? "red" : "black"}/> </div>
                                <div className={tickHovered ? "hover:cursor-pointer" : ""} onMouseOver={() => onTickHover(true)} onMouseLeave={() => onTickHover(false)} onClick={() => {handleAccept(requests)}}> <Check size="clamp(0.5rem,1vw,1rem)" color={tickHovered ? "green" : "black"}/> </div> 
                            </div>    
                        </div>) : <div className="italic text-[clamp(0.5rem,1vw,2rem)] flex justify-center ml-[0.5vw]"> There are no pending friend requests </div>}
                </div>
            </div>
        </div>      
    </>
}

export default RequestsButton;

// Today's session: 
