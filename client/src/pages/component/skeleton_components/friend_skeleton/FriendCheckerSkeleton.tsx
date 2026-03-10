import AddFriendButtonSkeleton from "./AddFriendButtonSkeleton";
import FriendBlockSkeleton from "./FriendBlockSkeleton";
import GroupButtonSkeleton from "./GroupButtonSkeleton";
import RequestsButtonSkeleton from "./RequestsButtonSkeleton";

export default function FriendCheckerSkeleton() {
    return <>
        <div className="flex justify-center flex-1 ml-[2vw] mr-[2vw] pt-[5vh] text-[#572e15] animate-pulse">
            <div className="border border-[#4A7C59] bg-[#3B1F0E] overflow-clip h-[80vh] flex flex-col w-[clamp(0.5em,15vw,100rem)] rounded-[1vw]">                   
                <div>
                    <div className="flex-col gap-[1vw] flex overflow-y-scroll no-scrollbar h-[73vh] pt-[1vh]">
                        <div className="flex sticky top-0 z-1006 bg-[#3B1F0E]"> 
                            <div className="flex justify-end font-bold underline w-3/5 text-[clamp(0.5rem,1vw,5rem)] text-[#FFF8F0]">
                                Friends 
                            </div>    
                            <div className="flex flex-1 justify-end pr-[1vw]">
                                <RequestsButtonSkeleton/> 
                            </div> 
                        </div>
                        <div className="flex justify-center items-center flex-col gap-[1vw]">
                            <FriendBlockSkeleton/>
                            <FriendBlockSkeleton/>
                            <FriendBlockSkeleton/>
                            <FriendBlockSkeleton/>
                        </div>
                    </div>
                    
                    <div className="flex justify-end pr-[0.5vw] items-center h-[5vh] gap-x-[0.5vw]">
                        <GroupButtonSkeleton/> 
                        <AddFriendButtonSkeleton/>
                    </div>
                </div>                    
            </div>
        </div>
    </>
}