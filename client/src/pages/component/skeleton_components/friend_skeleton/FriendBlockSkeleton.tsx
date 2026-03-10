import { UserRound } from "lucide-react";

export default function FriendBlockSkeleton() {
    return <>
        <div className="bg-[#F5ECD7] transition duration-500 shadow-sm w-[clamp(1em,11vw,100em)] border border-[#4A7C59] pt-[5vh] pb-[5vh]">  
            <div className="flex justify-center items-center"> 
                <button className="w-[clamp(1rem,1.25vw,100rem)] aspect-3/2 rounded-full absolute right-1 md:top-0.5 bottom-0.5 top-auto md:bottom-auto justify-center items-center transition duration-200"> <UserRound size="[10vw]"/> </button> 
            </div>          
        </div>          
    </>
} 