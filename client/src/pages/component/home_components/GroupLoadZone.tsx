import { X } from "lucide-react";
import { api } from "../../../interceptor/interceptor";
import type { groupFriends } from "../../../types/types";
import { useState, useEffect } from 'react';

type Prop = {
    friend: groupFriends[],
    addFriend:  React.Dispatch<React.SetStateAction<groupFriends[]>>,
    groupName: string,
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>,
}

// I have to add myself to the friend as well.

function GroupLoadZone({friend, groupName, openAddGroup, addFriend}: Prop) {
    const [ button, disableButton ] = useState(true);

    const handleClick = async () => {
        try {
            api.post('/friend/create-group', {groupName, friend}, {withCredentials: true});
            openAddGroup(false);
        } catch (err: any) {
            console.log(err.response.data.error)
        }
     }

    useEffect(() => {
        if (friend.length < 2 || groupName == "") disableButton(true); 
        else disableButton(false);
    }, [friend, groupName]);

    const handleDelete = (friend_id: string) => {       
        addFriend(friend.filter((e) => e.friend_id != friend_id));
    } 

    return <>
        <div className="w-[clamp(20rem,35vw,100rem)] mt-[3vh]">
            <div className= {["border border-[#7D9E8C] rounded-lg h-[20vh] bg-[#F5ECD7] w-full overflow-y-scroll no-scrollbar shadow-[inset_0_5px_4px_0_rgba(0,0,0,0.03)]", friend.length == 0 ? "justify-center flex pt-[1vh]" : "grid grid-cols-3 content-start pl-[1vw] pr-[1vw] pt-[1vh] pb-[1vh] gap-x-[2vw] gap-y-[2vh]"].join(" ")}> 
                {friend.length == 0 && <div className="italic text-black/30"> Add Member to Begin </div>}
                {friend.map((groupMember) => <div className="bg-[#3B1F0E] text-[#F5ECD7] pt-[1vh] pb-[1vh] rounded-full flex items-center shadow-[0_4px_30px_0_rgba(0,0,0,0.2)] text-[clamp(0.8rem,0.8vw,50rem)] justify-center relative flex-1"> <div className="min-w-0 max-w-[clamp(3rem,5vw,100rem)] truncate"> {groupMember.friend_name} </div> <div className="absolute right-[0.5vw] hover:cursor-pointer" onClick={() => {handleDelete(groupMember.friend_id)}}> <X size={"clamp(1rem,1vw,100rem)"}/> </div> </div>)}
            </div>

            <div className="mt-[2vh] w-full d h-[5vh] z-1002 flex justify-center items-end pr-[1vw] pb-[0.25vh] pt-[0.25vh]"> 
                <button disabled={button} onClick={() => handleClick()} className={["w-[clamp(10rem,20vw,100rem)] h-[5vh] rounded-xl flex justify-center items-center bg-[#4A7C59] backdrop-blur-2xlf font-bold text-[clamp(1rem,1vw,50rem)]", button ? "opacity-50" : "hover:cursor-pointer hover:scale-105 duration-250 transition shadow-[0_40px_3px_0_rgba(0,0,0,0,0.5)]"].join(" ")}> Create Group </button>
            </div>

        </div>
    </>
}

export default GroupLoadZone;