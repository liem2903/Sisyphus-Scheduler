import type { SetStateAction } from "react"
import type React from "react"
import { api } from "../../../interceptor/interceptor"
import type { friends } from "../../../types/types"

type Prop = {
    openUnfriend: React.Dispatch<SetStateAction<boolean>>,
    unfriendId: string,
    setFriendList: React.Dispatch<SetStateAction<friends[]>>,
    friendlist: friends[],
}

export default function UnaddFriend({openUnfriend, unfriendId, setFriendList, friendlist}: Prop) {
    const handleClick = async () => {
        await api.delete(`/friend/unfriend-id/${unfriendId}`);
        setFriendList(friendlist.filter((unfriended) => unfriended.id != unfriendId));
        openUnfriend(false);
    }

    return <>   
        <div className="flex justify-center items-center inset-0 absolute z-1008">
           <div className="bg-black/50 absolute inset-0" onClick={() => openUnfriend(false)}> </div>
           <div className="w-[clamp(25rem,40vw,100rem)] z-1008 bg-[#3B1F0E] absolute flex items-center justify-center flex-col gap-[3vh] rounded-lg shadow-[inset_0_4px_25px_0_rgba(0,0,0,0.2)] pb-[1vh]">
                <div className="w-[clamp(25rem,40vw,100rem)] z-1008 bg-[#3B1F0E] absolute flex items-center flex-col gap-[3vh] rounded-lg shadow-[inset_0_4px_25px_0_rgba(0,0,0,0.2)] pb-[1vh] pt-[1vh]">  
                    <div className="text-[#FFF8F0] pt-[1vh] italic font-bold"> Are you sure you want to delete this event? </div>   
                    <div className="flex gap-[1vw]"> 
                        <div className="bg-[#60ac75] w-32 h-10 text-lg flex justify-center items-center rounded-lg shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] cursor-pointer text-white font-bold hover:scale-105 transition duration-250" onClick={() => handleClick()}> Yes </div>
                        <div className="bg-[#8B3A3A] w-32 h-10 text-lg flex justify-center items-center rounded-lg shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] cursor-pointer text-white font-bold hover:scale-105 transition duration-250" onClick={() => openUnfriend(false)}>No</div>
                    </div>
                </div>
            </div>
        </div>
    </>   
}