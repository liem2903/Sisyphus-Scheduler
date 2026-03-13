import { api } from "../../../interceptor/interceptor";
import type { groupFriends } from "../../../types/types";
import { useState, useEffect } from 'react';

type Prop = {
    friend: groupFriends[],
    groupName: string,
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>,
}

// I have to add myself to the friend as well.

function GroupLoadZone({friend, groupName, openAddGroup}: Prop) {
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

    return <>
        <div className="w-[clamp(20rem,35vw,100rem)] fixed aspect-3/2 top-[45vh]">
            <div className= {["h-[20vh] bg-[#F5ECD7] shadow-gray-200 w-full relative overflow-y-scroll no-scrollbar shadow-[inset_0_4px_4px_0_rgba(0,0,0,1.0)]", friend.length == 0 ? "justify-center flex pt-[1vh]" : "grid grid-cols-3 content-start pl-[1vw] pr-[1vw] pt-[1vh] pb-[1vh] gap-x-[2vw] gap-y-[2vh]"].join(" ")}> 
                {friend.length == 0 && <div className="italic text-black/30"> Add Member to Begin </div>}
                {friend.map((groupMember) => <div className="bg-gray-400 pt-[1vh] pb-[1vh] rounded-md flex justify-center items-center"> {groupMember.friend_name} </div>)}
            </div>

            <div className="bg-[#F5ECD7] w-full d h-[5vh] z-1002 flex justify-center items-end pr-[1vw] pb-[0.25vh] pt-[0.25vh]"> 
                <button disabled={button} onClick={() => handleClick()} className={["w-[20vw] h-[5vh] rounded-xl flex justify-center items-center bg-[#4A7C59] shadow-2xl backdrop-blur-2xlf font-bold", button ? "opacity-50" : "hover:cursor-pointer hover:bg-[#4A7C59] shadow-[0_4px_40px_0_rgba(0,0,0,1.0)]"].join(" ")}> Create Group </button>
            </div>

        </div>
    </>
}

export default GroupLoadZone;