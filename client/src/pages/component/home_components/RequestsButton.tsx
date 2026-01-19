import type {friendRequest} from '../../../types/types'

type prop = {
    friendRequests: friendRequest[],
    setRequests: React.Dispatch<React.SetStateAction<friendRequest[]>>
}

import { Inbox, Check, X } from "lucide-react";
import React, { useState } from 'react';
import { api } from '../../../interceptor/interceptor';

// I want to be able to hover over my button and then my requests will pop up. I can accept and decline requests accordingly - but once my mouse LEAVES the div then the pop up disappears. No overlap.
function RequestsButton ({friendRequests, setRequests}: prop) { 
    const [ popUp, setPopup ] = useState(false);
    const [ tickHovered, onTickHover ] = useState(false);
    const [ crossHovered, onCrossHover ] = useState(false);

    const handleAccept = async (req: friendRequest) => {
        api.patch('/friend/accept-friend-request', {id: req.id, from_user: req.from_user},  {withCredentials: true});

        const tempReqList = friendRequests.filter((value) => {
            value.id == req.id;
        })

        setRequests(tempReqList);
    }   

    const handleDecline = async (req: friendRequest) => {
        api.patch('/friend/decline-friend-request', {id: req.id});

        const tempReqList = friendRequests.filter((value) => {
            value.id == req.id;
        })

        setRequests(tempReqList);
    }   

    return <>
        <div className="w-1/4 flex justify-center items-center relative" onMouseEnter={() => setPopup(true)} onMouseLeave={() => setPopup(false)}>
            <div className="border-2 rounded-full w-1/1 h-1/1 flex justify-center items-center hover:bg-amber-50 relative">
                <Inbox size="15"/> 
                <div className="absolute w-[0.75vw] h-[1.5vh] rounded-full bottom-[1.2vh] left-[0.7vw] bg-red-200 flex justify-center items-center text-xs"> {friendRequests.length} </div>
                {popUp && 
                <div className="absolute top-[1.25vw] w-[10.5vw] overflow-scroll z-100 no-scrollbar right-1 bg-[#F1EDFF] h-[20vh] pt-[1vh] flex-col flex items-center">
                    {friendRequests.length != 0 ? friendRequests.map((requests) => 
                        <div className="border-2 bg-violet-300 w-6/7 flex items-center justify-evenly gap-x-[1vw]"> 
                            <div className="pr-[0.5vw]">
                                {requests.requester_name}
                            </div>
                            <div className="flex gap-[0.1vw] pl-[0.4vw]">
                                <div className={crossHovered ? "hover:cursor-pointer" : ""} onMouseOver={() => onCrossHover(true)} onMouseLeave={() => onCrossHover(false)} onClick={() => {handleDecline(requests)}}> <X size="15" color={crossHovered ? "red" : "black"}/> </div>
                                <div className={tickHovered ? "hover:cursor-pointer" : ""} onMouseOver={() => onTickHover(true)} onMouseLeave={() => onTickHover(false)} onClick={() => {handleAccept(requests)}}> <Check size="15" color={tickHovered ? "green" : "black"}/> </div> 
                            </div>    
                         </div>) : <div className="font-bold h-full text-xs flex justify-center ml-[1vw]"> There are no pending friend requests </div>}
                </div>}
            </div>
        </div>      
    </>
}

export default RequestsButton;

// Today's session: 
