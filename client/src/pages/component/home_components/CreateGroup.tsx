import { useState } from "react";
import AddToGroup from "./AddToGroup";
import GroupLoadZone from "./GroupLoadZone";
import GroupTitle from "./GroupTitle";
import type { groupFriends } from "../../../types/types";

type prop = {
    openAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}

function CreateGroup({openAddGroup}: prop) {
    const [ focused, setFocused ] = useState<boolean>(false);
    const [ extend, setExtend ] = useState<boolean>(false);
    const [ friend, addFriend ] = useState<groupFriends[]>([]);
    const [ groupName, setGroupName ] = useState("");
    // AddToGroup --> highlights when focused and group title highlights when focused is false.
    return <>
        <div className="flex justify-center items-center inset-0 absolute z-1008">
           <div className="bg-black/50 absolute inset-0" onClick={() => openAddGroup(false)}> </div>
           <div className="w-[clamp(25rem,40vw,100rem)] z-1008 bg-[#3B1F0E] absolute flex items-center flex-col gap-[3vh] shadow-[inset_0_4px_5px_0_rgba(0,0,0,0.3)] pb-[1vh]" onClick={() => setExtend(false)}>
                <div className="flex w-[clamp(20rem,38vw,100rem)] mt-10 rounded-[1vw] z-999 max-h-[5vh] overflow-y-visible overflow-x-clipped gap-0 bg-[#F5ECD7]/30 focus:outline-none">                          
                    <AddToGroup setFocused={setFocused} focused={focused} extend={extend} setExtend={setExtend} addFriend={addFriend} friend={friend}/>
                    <GroupTitle setFocused={setFocused} focused={focused} setExtend={setExtend} groupName={groupName} setGroupName={setGroupName}/>
                </div>
                 <GroupLoadZone friend={friend} groupName={groupName} openAddGroup={openAddGroup}/>
            </div>
        </div>
    </>
}

export default CreateGroup;